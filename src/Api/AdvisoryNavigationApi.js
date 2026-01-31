import axios from "axios";

// Using the same base URL logic as other API files in CMS
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/advisory-navigation`;

// Get all navigation structure
export const getAdvisoryNavigation = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Create a new top-level nav item
export const createAdvisoryNavigation = async (data) => {
    const response = await axios.post(BASE_URL, data);
    return response.data;
};

// Update a nav item (e.g. adding submenus)
export const updateAdvisoryNavigation = async (id, data) => {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

// Delete a nav item
export const deleteAdvisoryNavigation = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};
