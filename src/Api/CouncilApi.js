import axios from "axios";

const CATEGORY_URL = `${import.meta.env.VITE_API_BASE_URL}/council`;
const ADVISOR_URL = `${import.meta.env.VITE_API_BASE_URL}/council-advisories`;

export const getCouncilByTitle = async (title) => {
    try {
        const response = await axios.get(`${CATEGORY_URL}/title/${title}`);
        return response.data;
    } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 400)) {
            // Return null or specific object to indicate not found
            return null;
        }
        throw error;
    }
};

export const createCouncilCategory = async (data) => {
    const response = await axios.post(CATEGORY_URL, data);
    return response.data;
};

export const updateCouncilCategory = async (id, data) => {
    const response = await axios.put(`${CATEGORY_URL}/${id}`, data);
    return response.data;
};

export const createAdvisor = async (data) => {
    const response = await axios.post(ADVISOR_URL, data);
    return response.data;
};

export const updateAdvisor = async (id, data) => {
    const response = await axios.put(`${ADVISOR_URL}/${id}`, data);
    return response.data;
};

export const deleteAdvisor = async (id) => {
    const response = await axios.delete(`${ADVISOR_URL}/${id}`);
    return response.data;
};
