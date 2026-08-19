import { useEffect, useState } from "react";
import {
  Box,
  Plus,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import AdminHeader from "../../components/admin/AdminHeader";
import ProductForm from "../../components/admin/ProductForm";
import ProductGrid from "../../components/admin/ProductGrid";
import { emptyProductForm } from "../../constants/adminProduct";



const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(emptyProductForm);

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

        <AdminHeader
          title="Products"
          description="Manage products, inventory and collection visibility."
        >
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-stone-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
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
        </AdminHeader>

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
          <ProductGrid
            products={products}
            openEditForm={openEditForm}
            handleStockUpdate={handleStockUpdate}
            handleDeactivate={handleDeactivate}
          />
        )}
      </div>

      {showForm && (
        <ProductForm
          form={form}
          categories={categories}
          editingProduct={editingProduct}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
          onFormChange={setForm}
        />
      )}
    </main>
  );
};

export default AdminProducts;