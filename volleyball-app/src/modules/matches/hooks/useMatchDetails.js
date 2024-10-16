import { useState, useEffect } from 'react';
import api from '../services/matchesService';

const useMatchDetails = (matchId) => {
  const [state, setState] = useState({
    match: null,
    loading: true,
    error: null
  });

  const fetchMatchDetails = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const matchResponse = await api.getMatch(matchId);
      const statsResponse = await api.getMatchStatistics(matchId);
      
      const matchData = matchResponse.data;
      const statsData = statsResponse.data;
      
      let weatherData = null;
      if (matchData.latitude && matchData.longitude && matchData.date) {
        try {
          weatherData = await api.getWeather(matchData.latitude, matchData.longitude, matchData.date);
        } catch (weatherError) {
          console.error('Error al obtener el clima:', weatherError);
        }
      }
      
      setState(prev => ({
        ...prev,
        match: {
          ...matchData,
          statistics: statsData,
          weather: weatherData
        },
        loading: false,
      }));
    } catch (err) {
      console.error('Error al cargar el partido:', err);
      setState(prev => ({
        ...prev,
        error: 'No se pudo cargar la información del partido',
        loading: false
      }));
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  return {
    ...state,
    fetchMatchDetails
  };
};

export default useMatchDetails;