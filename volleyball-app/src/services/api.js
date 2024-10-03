import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API base URL
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const api = {
  // Authentication
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login/`, credentials),
  logout: () => axios.post(`${API_BASE_URL}/auth/logout/`),
  getCurrentUser: () => axios.get(`${API_BASE_URL}/auth/user/`),

  // Teams
  getTeams: () => axios.get(`${API_BASE_URL}/teams/`),
  getTeam: (id) => axios.get(`${API_BASE_URL}/teams/${id}/`),
  createTeam: (teamData) => axios.post(`${API_BASE_URL}/teams/`, teamData),
  updateTeam: (id, teamData) => axios.put(`${API_BASE_URL}/teams/${id}/`, teamData),
  deleteTeam: (id) => axios.delete(`${API_BASE_URL}/teams/${id}/`),

  // Players
  getPlayers: () => axios.get(`${API_BASE_URL}/players/`),
  getPlayer: (id) => axios.get(`${API_BASE_URL}/players/${id}/`),
  createPlayer: (playerData) => axios.post(`${API_BASE_URL}/players/`, playerData),
  updatePlayer: (id, playerData) => axios.put(`${API_BASE_URL}/players/${id}/`, playerData),
  deletePlayer: (id) => axios.delete(`${API_BASE_URL}/players/${id}/`),

  // Matches
  getMatches: () => axios.get(`${API_BASE_URL}/matches/`),
  getMatch: (id) => axios.get(`${API_BASE_URL}/matches/${id}/`),
  createMatch: (matchData) => axios.post(`${API_BASE_URL}/matches/`, matchData),
  updateMatch: (id, matchData) => axios.put(`${API_BASE_URL}/matches/${id}/`, matchData),
  deleteMatch: (id) => axios.delete(`${API_BASE_URL}/matches/${id}/`),

  // Sets
  getSets: (matchId) => axios.get(`${API_BASE_URL}/matches/${matchId}/sets/`),
  createSet: (matchId, setData) => axios.post(`${API_BASE_URL}/matches/${matchId}/sets/`, setData),
  updateSet: (matchId, setId, setData) => axios.put(`${API_BASE_URL}/matches/${matchId}/sets/${setId}/`, setData),
  deleteSet: (matchId, setId) => axios.delete(`${API_BASE_URL}/matches/${matchId}/sets/${setId}/`),

  // Player Performances
  getPlayerPerformances: (matchId) => axios.get(`${API_BASE_URL}/matches/${matchId}/performances/`),
  createPlayerPerformance: (matchId, performanceData) => axios.post(`${API_BASE_URL}/matches/${matchId}/performances/`, performanceData),
  updatePlayerPerformance: (matchId, performanceId, performanceData) => axios.put(`${API_BASE_URL}/matches/${matchId}/performances/${performanceId}/`, performanceData),
  deletePlayerPerformance: (matchId, performanceId) => axios.delete(`${API_BASE_URL}/matches/${matchId}/performances/${performanceId}/`),

  // Weather
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