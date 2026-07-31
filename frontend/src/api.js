import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smart-factory1.onrender.com',
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