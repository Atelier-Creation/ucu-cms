import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/onlineApply`;


export const createWorkflow = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getAllWorkflows = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};


export const getStepById = async (id) => {
  const response = await axios.get(`${BASE_URL}/step/${id}`);
  return response.data;
};


export const updateStepById = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/step/${id}`, data);
  return response.data;
};

export const deleteStepById = async (id) => {
  const response = await axios.delete(`${BASE_URL}/step/${id}`);
  return response.data;
};
