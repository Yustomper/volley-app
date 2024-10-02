import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API || 'https://volley-app.onrender.com';

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
  login: (credentials) => axios.post(`${API_URL}/api/auth/login/`, credentials),
  register: (userData) => axios.post(`${API_URL}/api/auth/register/`, userData),
  logout: () => createAxiosInstance().post('/api/auth/logout/'),
  
  // Usuario
  getCurrentUser: () => createAxiosInstance().get('/api/auth/user/'),

  // Equipos
  getTeams: () => createAxiosInstance().get('/api/teams/'),
  createTeam: (teamData) => createAxiosInstance().post('/api/teams/', teamData),
  updateTeam: (teamId, teamData) => createAxiosInstance().put(`/api/teams/${teamId}/`, teamData),
  deleteTeam: (teamId) => createAxiosInstance().delete(`/api/teams/${teamId}/`),

  // Jugadores
  getPlayers: () => createAxiosInstance().get('/api/teams/players/'),
  createPlayer: (playerData) => createAxiosInstance().post('/api/teams/players/', playerData),
  updatePlayer: (playerId, playerData) => createAxiosInstance().put(`/api/teams/players/${playerId}/`, playerData),
  deletePlayer: (playerId) => createAxiosInstance().delete(`/api/teams/players/${playerId}/`),

  // Partidos
  getMatches: () => createAxiosInstance().get('/api/matches/'),
  getMatch: (id) => createAxiosInstance().get(`/api/matches/${id}/`),
  createMatch: (matchData) => createAxiosInstance().post('/api/matches/', matchData),
  updateMatch: (id, matchData) => createAxiosInstance().put(`/api/matches/${id}/`, matchData),
  deleteMatch: (id) => createAxiosInstance().delete(`/api/matches/${id}/`),

  // Sets
  createSet: (setData) => createAxiosInstance().post('/api/matches/sets/', setData),
  updateSet: (id, setData) => createAxiosInstance().put(`/api/matches/sets/${id}/`, setData),

  // Rendimiento del jugador
  createPlayerPerformance: (performanceData) => createAxiosInstance().post('/api/matches/performances/', performanceData),
  updatePlayerPerformance: (id, performanceData) => createAxiosInstance().put(`/api/matches/performances/${id}/`, performanceData),

  // Estadísticas
  getStatistics: () => axios.get(`${API_URL}/api/statistics/`),
};

export default api;