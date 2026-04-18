import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
});

export { API_URL, SOCKET_URL, UPLOAD_URL };
export default api;
