import axios from "axios";

const api = axios.create({
  baseURL: 
    process.env.REACT_APP_API_URL || "http://localhost:5000/api"
  // You can set REACT_APP_API_URL in your .env for production
});

// Attach token automatically to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
