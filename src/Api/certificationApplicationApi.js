import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/certification-applications`;

// 1. Get all submitted applications
export const getAllApplications = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};

// 2. Get a single application by ID
export const getApplicationById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// 3. Update application fields / status from CMS
export const updateApplication = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/update/${id}`, data);
  return response.data;
};

// 4. Delete application
export const deleteApplication = async (id) => {
  const response = await axios.delete(`${BASE_URL}/delete/${id}`);
  return response.data;
};
