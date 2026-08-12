import api from "./api";

const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);

  return response.data;
};

const getProductsByCategory = async (categoryId) => {
  const response = await api.get("/products", {
    params: {
      category: categoryId,
    },
  });

  return response.data;
};

// ====================
// Admin
// ====================

const createProduct = async (productData) => {
  const response = await api.post(
    "/products",
    productData
  );

  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

const updateProductStock = async (id, stock) => {
  const response = await api.patch(
    `/products/${id}/stock`,
    { stock }
  );

  return response.data;
};

const deactivateProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};

const productService = {
  getProducts,
  getProductBySlug,
  getProductsByCategory,

  // Admin
  createProduct,
  updateProduct,
  updateProductStock,
  deactivateProduct,
};

export default productService;