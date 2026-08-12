import api from "./api";

const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

const categoryService = {
  getCategories,
};

export default categoryService;