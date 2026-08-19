import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";
import mongoose from "mongoose";
import { uploadImageBuffer } from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    compareAtPrice,
    category,
    stock,
    sku,
    brand,
    material,
    color,
    isFeatured,
  } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    !category ||
    !sku
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Name, description, price, category and SKU are required",
    });
  }

  if (!req.files?.length) {
    return res.status(400).json({
      success: false,
      message: "At least one product image is required",
    });
  }

  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const existingProduct = await Product.findOne({
    $or: [{ slug }, { sku: sku.toUpperCase() }],
  });

  if (existingProduct) {
    return res.status(409).json({
      success: false,
      message: "Product with this name or SKU already exists",
    });
  }

  const uploadedImages = await Promise.all(
    req.files.map((file) =>
      uploadImageBuffer(file.buffer, file.originalname)
    )
  );

  const images = uploadedImages.map((image) => image.secure_url);

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    compareAtPrice,
    category,
    images,
    stock,
    sku: sku.toUpperCase(),
    brand,
    material,
    color,
    isFeatured: isFeatured === true || isFeatured === "true",
  });

  const populatedProduct = await Product.findById(product._id).populate(
    "category",
    "name slug parentCategory"
  );

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: {
      product: populatedProduct,
    },
  });
};

export const getProducts = async (req, res) => {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        featured,
        color,
        material,
        sort = "newest",
        page = 1,
        limit = 12,
      } = req.query;
  
      const filter = {
        isActive: true,
      };
  
      // =========================================================
      // SEARCH
      // =========================================================
  
      if (search) {
        filter.$or = [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            brand: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }
  
      // =========================================================
      // CATEGORY
      // =========================================================
  
      if (category) {
        const categoryValue = String(category).trim();
  
        let categoryDoc = null;
  
        // -------------------------------------------------------
        // 1. MongoDB ObjectId
        // -------------------------------------------------------
  
        if (mongoose.isValidObjectId(categoryValue)) {
          categoryDoc = await Category.findOne({
            _id: categoryValue,
            isActive: true,
          });
        }
  
        // -------------------------------------------------------
        // 2. Slug
        // -------------------------------------------------------
  
        if (!categoryDoc) {
          categoryDoc = await Category.findOne({
            slug: categoryValue.toLowerCase(),
            isActive: true,
          });
        }
  
        // -------------------------------------------------------
        // 3. Exact category name
        // -------------------------------------------------------
  
        if (!categoryDoc) {
          const escapedValue = categoryValue.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
  
          categoryDoc = await Category.findOne({
            name: {
              $regex: new RegExp(`^${escapedValue}$`, "i"),
            },
            isActive: true,
          });
        }
  
        // -------------------------------------------------------
        // 4. Normalized slug fallback
        // -------------------------------------------------------
  
        if (!categoryDoc) {
          const normalized = categoryValue
            .toLowerCase()
            .trim()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
  
          const candidates = [
            normalized,
            normalized.endsWith("s")
              ? normalized.slice(0, -1)
              : `${normalized}s`,
            normalized.endsWith("-bags")
              ? normalized.slice(0, -5)
              : `${normalized}-bags`,
          ].filter(Boolean);
  
          categoryDoc = await Category.findOne({
            isActive: true,
            $or: [
              {
                slug: {
                  $in: candidates,
                },
              },
              {
                name: {
                  $in: candidates,
                },
              },
            ],
          });
        }
  
        // -------------------------------------------------------
        // Category must exist
        // -------------------------------------------------------
  
        if (!categoryDoc) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }
  
        // =======================================================
        // IMPORTANT
        //
        // Determine whether this is a ROOT category.
        //
        // Root:
        //   Bags
        //   Footwear
        //   Dresses
        //   Jewelry
        //   Tops
        //
        // Subcategory:
        //   Backpacks
        //   Sneakers
        //   Heels
        //   etc.
        // =======================================================
  
        const isRootCategory =
          !categoryDoc.parentCategory;
  
        // -------------------------------------------------------
        // ROOT CATEGORY
        // -------------------------------------------------------
  
        if (isRootCategory) {
          /*
           * First collect the root category itself.
           */
          const categoryIds = [categoryDoc._id];
  
          /*
           * Find every descendant recursively.
           *
           * This supports:
           *
           * Bags
           *   ├── Handbags
           *   ├── Backpacks
           *   ├── Travel Bags
           *   ├── Duffle Bags
           *   └── Laptop Bags
           *
           * Footwear
           *   ├── Sneakers
           *   ├── Heels
           *   ├── Flats
           *   ├── Boots
           *   ├── Sandals
           *   └── Loafers
           */
  
          let parentsToSearch = [categoryDoc._id];
  
          while (parentsToSearch.length > 0) {
            const children = await Category.find({
              parentCategory: {
                $in: parentsToSearch,
              },
              isActive: true,
            }).select("_id");
  
            if (!children.length) {
              break;
            }
  
            const childIds = children.map(
              (child) => child._id
            );
  
            categoryIds.push(...childIds);
  
            parentsToSearch = childIds;
          }
  
          /*
           * Remove duplicate IDs.
           */
  
          const uniqueCategoryIds = [
            ...new Map(
              categoryIds.map((id) => [
                String(id),
                id,
              ])
            ).values(),
          ];
  
          filter.category = {
            $in: uniqueCategoryIds,
          };
        } else {
          // -----------------------------------------------------
          // SUBCATEGORY
          //
          // Example:
          //
          // /category/sneakers
          //
          // should ONLY return Sneakers.
          // -----------------------------------------------------
  
          filter.category = categoryDoc._id;
        }
      }
  
      // =========================================================
      // PRICE
      // =========================================================
  
      if (
        minPrice !== undefined ||
        maxPrice !== undefined
      ) {
        filter.price = {};
  
        if (minPrice !== undefined) {
          filter.price.$gte = Number(minPrice);
        }
  
        if (maxPrice !== undefined) {
          filter.price.$lte = Number(maxPrice);
        }
      }
  
      // =========================================================
      // FEATURED
      // =========================================================
  
      if (featured !== undefined) {
        filter.isFeatured =
          featured === "true";
      }
  
      // =========================================================
      // COLOR
      // =========================================================
  
      if (color) {
        filter.color = {
          $regex: String(color).trim(),
          $options: "i",
        };
      }
  
      // =========================================================
      // MATERIAL
      // =========================================================
  
      if (material) {
        filter.material = {
          $regex: String(material).trim(),
          $options: "i",
        };
      }
  
      // =========================================================
      // PAGINATION
      // =========================================================
  
      const currentPage = Math.max(
        Number(page) || 1,
        1
      );
  
      const itemsPerPage = Math.min(
        Math.max(Number(limit) || 12, 1),
        100
      );
  
      const skip =
        (currentPage - 1) * itemsPerPage;
  
      // =========================================================
      // SORTING
      // =========================================================
  
      let sortOption = {
        createdAt: -1,
      };
  
      if (sort === "price_asc") {
        sortOption = {
          price: 1,
        };
      }
  
      if (sort === "price_desc") {
        sortOption = {
          price: -1,
        };
      }
  
      if (sort === "name_asc") {
        sortOption = {
          name: 1,
        };
      }
  
      if (sort === "name_desc") {
        sortOption = {
          name: -1,
        };
      }
  
      // =========================================================
      // FETCH PRODUCTS
      // =========================================================
  
      const [products, totalProducts] =
        await Promise.all([
          Product.find(filter)
            .populate(
              "category",
              "name slug parentCategory"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(itemsPerPage),
  
          Product.countDocuments(filter),
        ]);
  
      // =========================================================
      // PAGINATION
      // =========================================================
  
      const totalPages =
        totalProducts === 0
          ? 0
          : Math.ceil(
              totalProducts / itemsPerPage
            );
  
      // =========================================================
      // RESPONSE
      // =========================================================
  
      return res.status(200).json({
        success: true,
  
        data: {
          products,
  
          pagination: {
            currentPage,
            itemsPerPage,
            totalProducts,
            totalPages,
  
            hasNextPage:
              currentPage < totalPages,
  
            hasPreviousPage:
              currentPage > 1,
          },
        },
      });
    } catch (error) {
      console.error(
        "GET PRODUCTS ERROR:",
        error
      );
  
      return res.status(500).json({
        success: false,
        message: "Failed to load products",
        error: error.message,
      });
    }
  };
  export const getProductBySlug = async (req, res) => {
    try {
      const product = await Product.findOne({
        slug: req.params.slug,
        isActive: true,
      }).populate("category", "name slug parentCategory");
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("Get product by slug error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  };
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const allowedFields = [
    "name",
    "description",
    "price",
    "compareAtPrice",
    "category",
    "stock",
    "brand",
    "material",
    "color",
    "isFeatured",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (updates.category) {
    const categoryExists = await Category.findById(updates.category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  }

  if (updates.name) {
    updates.slug = slugify(updates.name, {
      lower: true,
      strict: true,
    });
  }

  const productBeforeUpdate = await Product.findById(id);

  if (!productBeforeUpdate) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  let existingImages = productBeforeUpdate.images || [];

  if (req.body.existingImages !== undefined) {
    try {
      existingImages = JSON.parse(req.body.existingImages);
    } catch {
      existingImages = [];
    }

    if (!Array.isArray(existingImages)) {
      existingImages = [];
    }
  }

  if (req.files?.length) {
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadImageBuffer(file.buffer, file.originalname)
      )
    );

    existingImages = [
      ...existingImages,
      ...uploadedImages.map((image) => image.secure_url),
    ];
  }

  if (!existingImages.length) {
    return res.status(400).json({
      success: false,
      message: "At least one product image is required",
    });
  }

  updates.images = existingImages;
  if (updates.isFeatured !== undefined) {
    updates.isFeatured =
      updates.isFeatured === true || updates.isFeatured === "true";
  }

  const product = await Product.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name slug parentCategory");

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: {
      product,
    },
  });
};

export const deactivateProduct = async (req, res) => {
    const { id } = req.params;
  
    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  
    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
    });
  };

  export const updateProductStock = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
  
    if (stock === undefined || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative integer",
      });
    }
  
    const product = await Product.findByIdAndUpdate(
      id,
      {
        stock,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name slug parentCategory");
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  
    return res.status(200).json({
      success: true,
      message: "Product stock updated successfully",
      data: {
        product,
      },
    });
  };
export const activateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).populate("category", "name slug parentCategory");
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  return res.status(200).json({ success: true, message: "Product activated successfully", data: { product } });
};
