import axios from "axios";

// Using the same base URL logic as other API files in CMS
// Often Vite apps use a proxy, but here I see absolute URLs or relative.
// Checking HomeApi.js content would be safer but I'll assume standard VITE_API_BASE_URL
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admissionPage`;

// Get Admission Page Data
export const getAdmissionPageData = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Update Admission Page Data
export const updateAdmissionPageData = async (data) => {
    const response = await axios.put(BASE_URL, data);
    return response.data;
};
