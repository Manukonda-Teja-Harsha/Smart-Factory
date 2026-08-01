import axios from 'axios';
import { apiBaseUrl } from './config';

const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10000,
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
