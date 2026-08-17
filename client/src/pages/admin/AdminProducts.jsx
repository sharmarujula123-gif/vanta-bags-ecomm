import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Box,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "",
  imageFiles: [],
  existingImages: [],
  stock: 0,
  sku: "",
  brand: "Vanta",
  material: "",
  color: "",
  isFeatured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const imageFilePreviews = useMemo(
    () =>
      form.imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [form.imageFiles]
  );

  useEffect(() => {
    return () => {
      imageFilePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imageFilePreviews]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data =
        await productService.getProducts({
          page: 1,
          limit: 100,
        });

      setProducts(
        data.data?.products || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data =
        await categoryService.getCategories();

      setCategories(
        data.data?.categories || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load categories"
      );
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description:
        product.description || "",
      price: product.price ?? "",
      compareAtPrice:
        product.compareAtPrice ?? "",
      category:
        product.category?._id ||
        product.category ||
        "",
      imageFiles: [],
      existingImages: product.images || [],
      stock: product.stock ?? 0,
      sku: product.sku || "",
      brand: product.brand || "",
      material: product.material || "",
      color: product.color || "",
      isFeatured:
        product.isFeatured || false,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.price ||
      !form.category ||
      !form.sku.trim()
    ) {
      toast.error(
        "Name, description, price, category and SKU are required"
      );

      return;
    }

    if (
      !editingProduct &&
      form.imageFiles.length === 0
    ) {
      toast.error("Please choose at least one product image");
      return;
    }

    if (
      editingProduct &&
      form.existingImages.length === 0 &&
      form.imageFiles.length === 0
    ) {
      toast.error("Please keep or choose at least one product image");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("price", String(Number(form.price)));

      if (form.compareAtPrice !== "") {
        payload.append(
          "compareAtPrice",
          String(Number(form.compareAtPrice))
        );
      }

      payload.append("category", form.category);
      payload.append("stock", String(Number(form.stock)));
      payload.append("sku", form.sku.trim());
      payload.append("brand", form.brand.trim());
      payload.append("material", form.material.trim());
      payload.append("color", form.color.trim());
      payload.append("isFeatured", String(form.isFeatured));

      if (editingProduct) {
        payload.append(
          "existingImages",
          JSON.stringify(form.existingImages)
        );
      }

      form.imageFiles.forEach((file) => {
        payload.append("images", file);
      });

      if (editingProduct) {
        const data =
          await productService.updateProduct(
            editingProduct._id,
            payload
          );

        const updatedProduct =
          data.data?.product;

        if (updatedProduct) {
          setProducts((current) =>
            current.map((product) =>
              product._id ===
              updatedProduct._id
                ? updatedProduct
                : product
            )
          );
        }

        toast.success(
          "Product updated successfully"
        );
      } else {
        const data =
          await productService.createProduct(
            payload
          );

        const newProduct =
          data.data?.product;

        if (newProduct) {
          setProducts((current) => [
            newProduct,
            ...current,
          ]);
        }

        toast.success(
          "Product created successfully"
        );
      }

      closeForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStockUpdate = async (
    product
  ) => {
    const value = window.prompt(
      `Enter new stock for "${product.name}"`,
      String(product.stock)
    );

    if (value === null) return;

    const stock = Number(value);

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      toast.error(
        "Stock must be a non-negative integer"
      );

      return;
    }

    try {
      const data =
        await productService.updateProductStock(
          product._id,
          stock
        );

      const updatedProduct =
        data.data?.product;

      if (updatedProduct) {
        setProducts((current) =>
          current.map((item) =>
            item._id === updatedProduct._id
              ? updatedProduct
              : item
          )
        );
      }

      toast.success("Stock updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update stock"
      );
    }
  };

  const handleDeactivate = async (
    product
  ) => {
    const confirmed = window.confirm(
      `Deactivate "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await productService.deactivateProduct(
        product._id
      );

      setProducts((current) =>
        current.filter(
          (item) =>
            item._id !== product._id
        )
      );

      toast.success(
        "Product deactivated"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to deactivate product"
      );
    }
  };

  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
              VANTA ADMIN
            </p>

            <h1 className="mt-3 font-serif text-5xl">
              Products
            </h1>

            <p className="mt-3 text-sm text-stone-500">
              Manage products, inventory and
              collection visibility.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-stone-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800"
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>
        </div>

        {/* Products */}

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse bg-stone-200"
                />
              )
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 border border-stone-200 bg-white px-6 py-16 text-center">
            <Box
              size={42}
              className="mx-auto text-stone-400"
            />

            <h2 className="mt-5 font-serif text-2xl">
              No products
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Add your first product to the
              catalog.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const lowStock =
                product.stock <= 5;

              return (
                <article
                  key={product._id}
                  className="overflow-hidden border border-stone-200 bg-white"
                >
                  {/* Image */}

                  <div className="relative aspect-[4/3] bg-stone-100">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.2em] text-stone-400">
                        VANTA
                      </div>
                    )}

                    {product.isFeatured && (
                      <span className="absolute left-3 top-3 bg-stone-950 px-3 py-1.5 text-[9px] font-bold tracking-[0.15em] text-white">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Info */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-xl">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs text-stone-500">
                          SKU: {product.sku}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-y border-stone-100 py-4">
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400">
                          STOCK
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            lowStock
                              ? "text-red-600"
                              : "text-stone-950"
                          }`}
                        >
                          {product.stock} units
                        </p>
                      </div>

                      {lowStock && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                          <AlertTriangle
                            size={13}
                          />
                          LOW STOCK
                        </span>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 border border-stone-300 px-3 py-2 text-xs font-semibold hover:bg-stone-50"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStockUpdate(
                            product
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 border border-stone-300 px-3 py-2 text-xs font-semibold hover:bg-stone-50"
                      >
                        <Box size={14} />
                        Stock
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeactivate(
                            product
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Hide
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Product form modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-8">
          <div className="mx-auto max-w-2xl bg-white shadow-xl">

            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400">
                  PRODUCT MANAGEMENT
                </p>

                <h2 className="mt-1 font-serif text-2xl">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold">
                    Product Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Example: Vanta Leather Tote"
                  />
                </div>

                {/* Description */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-2 w-full resize-none border border-stone-300 p-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Describe the product..."
                  />
                </div>

                {/* Price */}

                <div>
                  <label className="text-xs font-semibold">
                    Price
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="2999"
                  />
                </div>

                {/* Compare price */}

                <div>
                  <label className="text-xs font-semibold">
                    Compare At Price
                  </label>

                  <input
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    value={form.compareAtPrice}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="3999"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="text-xs font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none focus:border-stone-950"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* SKU */}

                <div>
                  <label className="text-xs font-semibold">
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    disabled={
                      Boolean(editingProduct)
                    }
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm uppercase outline-none focus:border-stone-950 disabled:bg-stone-100"
                    placeholder="VB-TOTE-001"
                  />
                </div>

                {/* Stock */}

                <div>
                  <label className="text-xs font-semibold">
                    Stock
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                  />
                </div>

                {/* Brand */}

                <div>
                  <label className="text-xs font-semibold">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                  />
                </div>

                {/* Material */}

                <div>
                  <label className="text-xs font-semibold">
                    Material
                  </label>

                  <input
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Leather"
                  />
                </div>

                {/* Color */}

                <div>
                  <label className="text-xs font-semibold">
                    Color
                  </label>

                  <input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Black"
                  />
                </div>

                {/* Images */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold">
                    Product Images
                  </label>

                  <label
                    htmlFor="product-images"
                    className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-stone-50 px-5 py-7 text-center hover:border-stone-950 hover:bg-white"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="mt-2 text-sm font-semibold">
                      Choose Images
                    </span>
                    <span className="mt-1 text-[11px] text-stone-400">
                      JPG, JPEG, PNG or WEBP · up to 5 MB each · max 10
                    </span>
                    <input
                      id="product-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files || []);
                        setForm((current) => ({
                          ...current,
                          imageFiles: [
                            ...current.imageFiles,
                            ...files,
                          ],
                        }));
                        event.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>

                  {(form.existingImages.length > 0 ||
                    form.imageFiles.length > 0) && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {form.existingImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative aspect-square overflow-hidden bg-stone-100"
                        >
                          <img
                            src={image}
                            alt={`${form.name || "Product"} ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                existingImages:
                                  current.existingImages.filter(
                                    (_, imageIndex) =>
                                      imageIndex !== index
                                  ),
                              }))
                            }
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-stone-950 shadow hover:bg-white"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {form.imageFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className="group relative aspect-square overflow-hidden bg-stone-100"
                        >
                          <img
                            src={imageFilePreviews[index]?.url}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                imageFiles:
                                  current.imageFiles.filter(
                                    (_, fileIndex) =>
                                      fileIndex !== index
                                  ),
                              }))
                            }
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-stone-950 shadow hover:bg-white"
                            aria-label="Remove selected image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-2 text-[11px] text-stone-400">
                    {editingProduct
                      ? "Keep existing images, remove them, or add new images."
                      : "Choose one or more images. The backend uploads them to Cloudinary automatically."}
                  </p>
                </div>

                {/* Featured */}

                <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm">
                    Mark as featured product
                  </span>
                </label>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-stone-200 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="border border-stone-300 px-5 py-3 text-sm font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:bg-stone-400"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminProducts;