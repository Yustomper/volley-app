// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API;
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

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
  logout: () => createAxiosInstance().post(`${API_URL}/api/auth/logout/`),
  
  // Usuario
  getCurrentUser: () => createAxiosInstance().get(`${API_URL}/api/auth/user/`),

  // Equipos
  getTeams: () => createAxiosInstance().get(`${API_URL}/api/teams/`),
  createTeam: (teamData) => createAxiosInstance().post(`${API_URL}/api/teams/`, teamData),
  updateTeam: (teamId, teamData) => createAxiosInstance().put(`${API_URL}/api/teams/${teamId}/`, teamData),
  deleteTeam: (teamId) => createAxiosInstance().delete(`${API_URL}/api/teams/${teamId}/`),

  // Jugadores
  getPlayers: () => createAxiosInstance().get(`${API_URL}/api/teams/players/`),
  createPlayer: (playerData) => createAxiosInstance().post(`${API_URL}/api/teams/players/`, playerData),
  updatePlayer: (playerId, playerData) => createAxiosInstance().put(`${API_URL}/api/teams/players/${playerId}/`, playerData),
  deletePlayer: (playerId) => createAxiosInstance().delete(`${API_URL}/api/teams/players/${playerId}/`),

  // Partidos
  getMatches: () => createAxiosInstance().get(`${API_URL}/api/matches/`),
  getMatch: (id) => createAxiosInstance().get(`${API_URL}/api/matches/${id}/`),
  createMatch: (matchData) => createAxiosInstance().post(`${API_URL}/api/matches/`, matchData),
  updateMatch: (id, matchData) => createAxiosInstance().put(`${API_URL}/api/matches/${id}/`, matchData),
  deleteMatch: (id) => createAxiosInstance().delete(`${API_URL}/api/matches/${id}/`),

  // Sets
  createSet: (setData) => createAxiosInstance().post(`${API_URL}/api/matches/sets/`, setData),
  updateSet: (id, setData) => createAxiosInstance().put(`${API_URL}/api/matches/sets/${id}/`, setData),

  // Rendimiento del jugador
  createPlayerPerformance: (performanceData) => createAxiosInstance().post(`${API_URL}/api/matches/performances/`, performanceData),
  updatePlayerPerformance: (id, performanceData) => createAxiosInstance().put(`${API_URL}/api/matches/performances/${id}/`, performanceData),

  // Estadísticas
  getStatistics: () => axios.get(`${API_URL}/api/statistics/`),

  // Clima
  getWeather: async (location, date) => {
    try {
      // This is a simplified example. In a real-world scenario, you'd need to implement geocoding.
      const [lat, lon] = await getCoordinates(location);
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,weathercode',
          start_date: date.split('T')[0],
          end_date: date.split('T')[0],
        }
      });

      const hour = new Date(date).getHours();
      const temperature = response.data.hourly.temperature_2m[hour];
      const weathercode = response.data.hourly.weathercode[hour];

      return {
        temperature,
        condition: getWeatherCondition(weathercode),
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },
};

// Helper functions
async function getCoordinates(location) {
  // This is a placeholder. You should implement actual geocoding here.
  // For now, we'll return fixed coordinates for demonstration purposes.
  return [52.52, 13.41]; // Berlin coordinates
}

function getWeatherCondition(code) {
  // This is a simplified weather code interpretation
  if (code < 3) return 'Clear';
  if (code < 50) return 'Cloudy';
  if (code < 70) return 'Rainy';
  return 'Stormy';
}

export default api;
