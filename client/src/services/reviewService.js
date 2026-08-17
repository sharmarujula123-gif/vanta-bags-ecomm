import api from "./api";
const getReviews = async (productId) =>
	(await api.get(`/reviews/${productId}`)).data;
const createReview = async (productId, payload) =>
	(await api.post(`/reviews/${productId}`, payload)).data;
export default { getReviews, createReview };
