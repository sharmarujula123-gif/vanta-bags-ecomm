import api from "./api";

const getAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data;
};

const getAddressById = async (id) => {
  const response = await api.get(`/addresses/${id}`);
  return response.data;
};

const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);
  return response.data;
};

const updateAddress = async (id, addressData) => {
  const response = await api.patch(
    `/addresses/${id}`,
    addressData
  );

  return response.data;
};

const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};

const setDefaultAddress = async (id) => {
  const response = await api.patch(
    `/addresses/${id}/default`
  );

  return response.data;
};

const addressService = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

export default addressService;