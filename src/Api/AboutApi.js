import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/about`;

// Navigation
export const getAboutNavigation = async () => {
    const response = await axios.get(`${BASE_URL}/nav`);
    return response.data;
};

export const createAboutNavigation = async (data) => {
    const response = await axios.post(`${BASE_URL}/nav`, data);
    return response.data;
};

export const updateAboutNavigation = async (id, data) => {
    const response = await axios.put(`${BASE_URL}/nav/${id}`, data);
    return response.data;
};

export const deleteAboutNavigation = async (id) => {
    const response = await axios.delete(`${BASE_URL}/nav/${id}`);
    return response.data;
};

// Page Content
export const getAboutPageData = async (slug) => {
    const response = await axios.get(`${BASE_URL}/page/${slug}`);
    return response.data;
};

export const updateAboutPageData = async (slug, data) => {
    const response = await axios.put(`${BASE_URL}/page/${slug}`, data);
    return response.data;
};
