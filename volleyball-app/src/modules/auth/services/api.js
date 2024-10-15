// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;


// Función para crear una instancia de axios con el token
const createAxiosInstance = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Token ${token}` } : {},
  });
};

const api = {
  // Autenticación
  login: (credentials) => axios.post(`${API_URL}/api/auth/login/`, credentials),
  register: (userData) => axios.post(`${API_URL}/api/auth/register/`, userData),

  logout: () => createAxiosInstance().post(`/api/auth/logout/`),

  // Usuario
  getCurrentUser: () => createAxiosInstance().get(`/api/auth/user/`),

}

export default api;
