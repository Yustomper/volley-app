// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Función para crear una instancia de axios con el token
const createAxiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Token ${token}` } : {}
  });
};

const api = {
  // Autenticación
  login: (credentials) => axios.post(`${API_URL}/auth/login/`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register/`, userData),
  logout: () => createAxiosInstance().post(`${API_URL}/auth/logout/`),
  
  // Usuario
  getCurrentUser: () => createAxiosInstance().get(`${API_URL}/auth/user/`),

  // Equipos
  getTeams: () => createAxiosInstance().get(`${API_URL}/teams/`),
  createTeam: (teamData) => createAxiosInstance().post(`${API_URL}/teams/`, teamData),
  updateTeam: (teamId, teamData) => createAxiosInstance().put(`${API_URL}/teams/${teamId}/`, teamData),
  deleteTeam: (teamId) => createAxiosInstance().delete(`${API_URL}/teams/${teamId}/`),

  // Jugadores
  getPlayers: () => createAxiosInstance().get(`${API_URL}/teams/players/`),
  createPlayer: (playerData) => createAxiosInstance().post(`${API_URL}/teams/players/`, playerData),
  updatePlayer: (playerId, playerData) => createAxiosInstance().put(`${API_URL}/teams/players/${playerId}/`, playerData),
  deletePlayer: (playerId) => createAxiosInstance().delete(`${API_URL}/teams/players/${playerId}/`),

  // Partidos
  getMatches: () => createAxiosInstance().get(`${API_URL}/matches/`),
  getMatch: (id) => createAxiosInstance().get(`${API_URL}/matches/${id}/`),
  createMatch: (matchData) => createAxiosInstance().post(`${API_URL}/matches/`, matchData),
  updateMatch: (id, matchData) => createAxiosInstance().put(`${API_URL}/matches/${id}/`, matchData),
  deleteMatch: (id) => createAxiosInstance().delete(`${API_URL}/matches/${id}/`),

  // Sets
  createSet: (setData) => createAxiosInstance().post(`${API_URL}/matches/sets/`, setData),
  updateSet: (id, setData) => createAxiosInstance().put(`${API_URL}/matches/sets/${id}/`, setData),

  // Rendimiento del jugador
  createPlayerPerformance: (performanceData) => createAxiosInstance().post(`${API_URL}/matches/performances/`, performanceData),
  updatePlayerPerformance: (id, performanceData) => createAxiosInstance().put(`${API_URL}/matches/performances/${id}/`, performanceData),

  // Estadísticas
  getStatistics: () => axios.get(`${API_URL}/statistics/`),
};

export default api;