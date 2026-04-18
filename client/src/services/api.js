import axios from 'axios';

// The deployed backend URL on Vercel
const DEPLOYED_URL = 'https://restoplus-dh2k.vercel.app';

const API_URL = import.meta.env.VITE_API_URL || `${DEPLOYED_URL}/api`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEPLOYED_URL;
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || DEPLOYED_URL;

const api = axios.create({
    baseURL: API_URL,
});

export { API_URL, SOCKET_URL, UPLOAD_URL };
export default api;
