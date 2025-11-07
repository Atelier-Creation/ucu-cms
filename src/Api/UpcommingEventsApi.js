import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/upcommingEvent`;

// ✅ Create a banner
export const createEvent = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

// ✅ Get all banners
export const getAllEvents = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// ✅ Get banner by ID
export const getEventById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// ✅ Update banner
export const updateEvent = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// ✅ Delete banner
export const deleteEvent = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
