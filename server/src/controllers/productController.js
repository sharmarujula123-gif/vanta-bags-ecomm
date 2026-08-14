import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugify from "slugify";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    compareAtPrice,
    category,
    images,
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
    isFeatured,
  });

  const populatedProduct = await Product.findById(product._id).populate(
    "category",
    "name slug"
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
    const {
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;
  
    const filter = {
      isActive: true,
    };
  
    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }
    // Category
    // Accept category slug, MongoDB ObjectId, or category name.
    if (category) {
      const categoryValue = String(category).trim();
      let categoryDoc = null;

      if (mongoose.isValidObjectId(categoryValue)) {
        categoryDoc = await Category.findOne({
          _id: categoryValue,
          isActive: true,
        });
      }

      if (!categoryDoc) {
        categoryDoc = await Category.findOne({
          slug: categoryValue.toLowerCase(),
          isActive: true,
        });
      }

      if (!categoryDoc) {
        categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(`^${categoryValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
          isActive: true,
        });
      }

      // Be forgiving with legacy category slugs such as "duffle-bag" vs
      // "duffle-bags" and with names containing punctuation/spaces.
      if (!categoryDoc) {
        const normalized = categoryValue
          .toLowerCase()
          .trim()
          .replace(/&/g, "and")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const candidates = [
          normalized,
          normalized.endsWith("-bags") ? normalized.slice(0, -1) : `${normalized}s`,
          normalized.endsWith("-bag") ? `${normalized}s` : normalized,
          normalized.endsWith("-bags") ? normalized.slice(0, -5) : normalized,
        ].filter(Boolean);

        categoryDoc = await Category.findOne({
          isActive: true,
          slug: { $in: candidates },
        });
      }

      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      filter.category = categoryDoc._id;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
  
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
  
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }
  
    // Featured
    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }
  
    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (currentPage - 1) * itemsPerPage;
  
    // Sorting
    let sortOption = { createdAt: -1 };
  
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }
  
    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }
  
    if (sort === "name_asc") {
      sortOption = { name: 1 };
    }
  
    if (sort === "name_desc") {
      sortOption = { name: -1 };
    }
  
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(itemsPerPage),
  
      Product.countDocuments(filter),
    ]);
  
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
  
    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage,
          itemsPerPage,
          totalProducts,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        },
      },
    });
  };

export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate("category", "name slug");

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
};
export const updateProduct = async (req, res) => {
    const { id } = req.params;
  
    const allowedFields = [
      "name",
      "description",
      "price",
      "compareAtPrice",
      "category",
      "images",
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
  
    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name slug");
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  
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
    ).populate("category", "name slug");
  
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
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).populate("category", "name slug");
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  return res.status(200).json({ success: true, message: "Product activated successfully", data: { product } });
};
