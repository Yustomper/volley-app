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

  getTeams: () => createAxiosInstance().get(`/api/teams/`),

  // Matches
  getMatches: (params) => createAxiosInstance().get("/api/matches/", { params }),
  getMatch: (id) => createAxiosInstance().get(`/api/matches/${id}/`),
  createMatch: (matchData) => createAxiosInstance().post("/api/matches/", matchData),
  updateMatch: (id, matchData) => createAxiosInstance().put(`/api/matches/${id}/`, matchData),
  deleteMatch: (id) => createAxiosInstance().delete(`/api/matches/${id}/`),

  // Nuevos métodos para el partido de voleibol
  startMatch: (matchId) => createAxiosInstance().post(`/api/matches/${matchId}/start_match/`),
  endMatch: (matchId) => createAxiosInstance().post(`/api/matches/${matchId}/end_match/`),
  updateMatchScore: (matchId, data) => createAxiosInstance().post(`/api/matches/${matchId}/update_score/`, data),

  // Corregido aquí el método de performance para evitar dobles // en las rutas
  updatePlayerPerformance: (performanceId, data) =>
    createAxiosInstance().put(`/api/matches/performances/${performanceId}/`, data),

  // Sets
  createSet: (setData) =>
    createAxiosInstance().post(`/api/matches/sets/`, setData),
  updateSet: (id, setData) =>
    createAxiosInstance().put(`/api/matches/sets/${id}/`, setData),

  // Estadísticas
  getMatchStatistics: (matchId) => createAxiosInstance().get(`/api/statistics/match/${matchId}/`),

};


export default api;
