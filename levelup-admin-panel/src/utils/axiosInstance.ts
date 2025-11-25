import axios from "axios";
import { AuthService } from "@/services/AuthService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Cambia esto por la URL base de tu API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT a cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;