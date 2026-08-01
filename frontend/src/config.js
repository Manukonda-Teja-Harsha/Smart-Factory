const isProd = import.meta.env.PROD;

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (isProd ? 'https://YOUR_RENDER_BACKEND_URL.onrender.com/api' : '/api');
export const appEnv = import.meta.env.MODE;
