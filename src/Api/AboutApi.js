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

// Leadership
export const getLeadershipPages = async () => {
    const response = await axios.get(`${BASE_URL}/leadership`);
    return response.data;
};

export const createLeadershipPage = async (data) => {
    const response = await axios.post(`${BASE_URL}/leadership`, data);
    return response.data;
};

export const getLeadershipPageBySlug = async (slug) => {
    const response = await axios.get(`${BASE_URL}/leadership/${slug}`);
    return response.data;
};

export const updateLeadershipPage = async (slug, data) => {
    const response = await axios.put(`${BASE_URL}/leadership/${slug}`, data);
    return response.data;
};

export const deleteLeadershipPage = async (id) => {
    const response = await axios.delete(`${BASE_URL}/leadership/${id}`);
    return response.data;
};

// Industry Approach
export const getIndustryApproachPages = async () => {
    const response = await axios.get(`${BASE_URL}/industry-approach`);
    return response.data;
};

export const createIndustryApproachPage = async (data) => {
    const response = await axios.post(`${BASE_URL}/industry-approach`, data);
    return response.data;
};

export const getIndustryApproachPageBySlug = async (slug) => {
    const response = await axios.get(`${BASE_URL}/industry-approach/${slug}`);
    return response.data;
};

export const updateIndustryApproachPage = async (slug, data) => {
    const response = await axios.put(`${BASE_URL}/industry-approach/${slug}`, data);
    return response.data;
};

export const deleteIndustryApproachPage = async (id) => {
    const response = await axios.delete(`${BASE_URL}/industry-approach/${id}`);
    return response.data;
};

// Founder Message
export const getFounderMessagePages = async () => {
    const response = await axios.get(`${BASE_URL}/founder-message`);
    return response.data;
};

export const createFounderMessagePage = async (data) => {
    const response = await axios.post(`${BASE_URL}/founder-message`, data);
    return response.data;
};

export const getFounderMessagePageBySlug = async (slug) => {
    const response = await axios.get(`${BASE_URL}/founder-message/${slug}`);
    return response.data;
};

export const updateFounderMessagePage = async (slug, data) => {
    const response = await axios.put(`${BASE_URL}/founder-message/${slug}`, data);
    return response.data;
};

export const deleteFounderMessagePage = async (id) => {
    const response = await axios.delete(`${BASE_URL}/founder-message/${id}`);
    return response.data;
};
