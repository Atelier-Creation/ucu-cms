import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/faculty-buckets`;

export const getFacultyBuckets = async () => {
  const response = await axios.get(BASE_URL);
  return response.data?.data || [];
};

export const updateFacultyBuckets = async (buckets) => {
  const response = await axios.put(BASE_URL, { buckets });
  return response.data?.data || [];
};
