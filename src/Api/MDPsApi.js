import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/mdps`;

export const getMDPsData = async () => {
  const response = await axios.get(BASE_URL);
  return response.data?.data?.[0];
};

export const updateMDPsData = async (data) => {
  const response = await axios.put(BASE_URL, data);
  return response.data?.data;
};
