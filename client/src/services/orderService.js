import api from "./api";

const createOrder = async (shippingAddress) => {
  const response = await api.post("/orders", {
    shippingAddress,
  });

  return response.data;
};

const getPendingPaymentOrder = async () => {
  const response = await api.get("/orders/pending-payment");
  return response.data;
};

const getMyOrders = async () => {
  const response = await api.get("/orders/my");

  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

const cancelOrder = async (id) => {
  const response = await api.patch(
    `/orders/${id}/cancel`
  );

  return response.data;
};

// ====================
// Admin
// ====================

const getAllOrders = async () => {
  const response = await api.get(
    "/orders/admin/all"
  );

  return response.data;
};

const getAdminOrderById = async (id) => {
  const response = await api.get(
    `/orders/admin/${id}`
  );

  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await api.patch(
    `/orders/admin/${id}/status`,
    { status }
  );

  return response.data;
};

const orderService = {
  createOrder,
  getPendingPaymentOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,

  // Admin
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
};

export default orderService;