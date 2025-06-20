import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001", // backend URL
});

// Automatically attach token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
