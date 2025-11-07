import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/aspirant`;

// ✅ Create a banner
export const createAspirant = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

// ✅ Get all banners
export const getAllAspirants = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// ✅ Get banner by ID
export const getAspirantById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// ✅ Update banner
export const updateAspirant = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// ✅ Delete banner
export const deleteAspirant = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
