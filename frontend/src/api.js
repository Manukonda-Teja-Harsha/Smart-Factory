import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
