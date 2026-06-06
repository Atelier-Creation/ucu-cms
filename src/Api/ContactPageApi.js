import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/contact`;

export const getContactPageData = async () => {
  const response = await axios.get(BASE_URL);
  return response.data?.data;
};

export const updateContactPageData = async (data) => {
  const response = await axios.put(BASE_URL, data);
  return response.data?.data;
};
