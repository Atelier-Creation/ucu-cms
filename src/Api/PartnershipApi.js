import axios from "axios";

const CATEGORY_URL = `${import.meta.env.VITE_API_BASE_URL}/partnershipCategory`;
const DATA_URL = `${import.meta.env.VITE_API_BASE_URL}/partnershipData`;

// --- CATEGORIES ---

export const getPartnershipCategories = async () => {
    const response = await axios.get(CATEGORY_URL);
    return response.data;
};

export const createPartnershipCategory = async (data) => {
    const response = await axios.post(CATEGORY_URL, data);
    return response.data;
};

export const updatePartnershipCategory = async (id, data) => {
    const response = await axios.put(`${CATEGORY_URL}/${id}`, data);
    return response.data;
};

export const deletePartnershipCategory = async (id) => {
    const response = await axios.delete(`${CATEGORY_URL}/${id}`);
    return response.data;
};

// --- DATA ---

export const getPartnershipData = async () => {
    const response = await axios.get(DATA_URL);
    return response.data;
};

export const createPartnershipData = async (data) => {
    const response = await axios.post(DATA_URL, data);
    return response.data;
};

export const updatePartnershipData = async (id, data) => {
    const response = await axios.put(`${DATA_URL}/${id}`, data);
    return response.data;
};

export const deletePartnershipData = async (id) => {
    const response = await axios.delete(`${DATA_URL}/${id}`);
    return response.data;
};
