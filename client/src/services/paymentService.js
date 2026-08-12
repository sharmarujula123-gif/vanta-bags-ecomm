import api from "./api";

const createPayment = async (orderId) => {
  const response = await api.post("/payments", {
    orderId,
  });

  return response.data;
};

const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const response = await api.post("/payments/verify", {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return response.data;
};

const paymentService = {
  createPayment,
  verifyPayment,
};

export default paymentService;