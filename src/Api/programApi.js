import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/fulltimeprograms`;

// ✅ Create a program
export const createProgram = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

// ✅ Get all programs
export const getAllPrograms = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// ✅ Get program by ID
export const getProgramById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// ✅ Update program
export const updateProgram = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// ✅ Delete program
export const deleteProgram = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
