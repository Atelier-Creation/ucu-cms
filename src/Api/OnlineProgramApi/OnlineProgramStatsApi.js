import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/onlineStats`;


export const createOnlineStats = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getAllOnlineStats = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};


export const getOnlineStatById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};


export const updateOnlineStat = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteOnlineStat = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
