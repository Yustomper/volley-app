import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiDayThunderstorm, WiDayFog } from 'react-icons/wi';
import api from '../services/api';
import { weatherService } from '../services/weatherService';

const MatchDetails = () => {
  const { isDarkMode } = useTheme();
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const response = await api.getMatch(matchId);
      setMatch(response.data);
      if (response.data.latitude && response.data.longitude) {
        const weatherData = await weatherService.getWeather(
          response.data.latitude,
          response.data.longitude,
          response.data.date
        );
        if (weatherData) {
          setWeather({
            temperature: weatherData.temperature,
            ...getWeatherCondition(weatherData.weatherCode)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCondition = (code) => {
    if (code === 0) return { text: 'Despejado', icon: <WiDaySunny className="inline-block text-4xl" /> };
    if (code === 1 || code === 2 || code === 3) return { text: 'Parcialmente nublado', icon: <WiCloudy className="inline-block text-4xl" /> };
    if (code >= 51 && code <= 67) return { text: 'Lluvia', icon: <WiRain className="inline-block text-4xl" /> };
    if (code >= 71 && code <= 77) return { text: 'Nieve', icon: <WiSnow className="inline-block text-4xl" /> };
    if (code >= 95 && code <= 99) return { text: 'Tormenta', icon: <WiDayThunderstorm className="inline-block text-4xl" /> };
    return { text: 'Niebla', icon: <WiDayFog className="inline-block text-4xl" /> };
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-300 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <p>No se encontró el partido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} p-6 rounded-lg shadow-lg mb-8`}>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold">{match.home_team.name}</h2>
            </div>
            <div className="text-center">
              <h1 className={`text-6xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
                {match.home_team_score || 0} : {match.away_team_score || 0}
              </h1>
              <p className="text-lg mt-2">
                {new Date(match.date).toLocaleDateString()} - {match.location}
              </p>
              {weather && (
                <div className="flex items-center justify-center mt-1">
                  {weather.icon}
                  <span className="ml-2">{weather.temperature}°C, {weather.text}</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold">{match.away_team.name}</h2>
            </div>
          </div>
          
          {/* Detalles de los sets */}
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            {match.sets.map((set) => (
              <div key={set.id} className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <p className="font-semibold">Set {set.set_number}</p>
                <p>{set.home_team_score} - {set.away_team_score}</p>
              </div>
            ))}
          </div>

          {/* Estadísticas de jugadores */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Equipo Local */}
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
                {match.home_team.name} - Estadísticas
              </h3>
              {match.player_performances
                .filter(perf => match.home_team.players.some(p => p.id === perf.player))
                .map(performance => (
                  <div key={performance.id} className={`mb-2 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <p className="font-semibold">{performance.player_name}</p>
                    <p>
                      Puntos: {performance.points}, 
                      Bloqueos: {performance.blocks}, 
                      Aces: {performance.aces},
                      Recepciones: {performance.digs}
                    </p>
                  </div>
                ))}
            </div>

            {/* Equipo Visitante */}
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
                {match.away_team.name} - Estadísticas
              </h3>
              {match.player_performances
                .filter(perf => match.away_team.players.some(p => p.id === perf.player))
                .map(performance => (
                  <div key={performance.id} className={`mb-2 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <p className="font-semibold">{performance.player_name}</p>
                    <p>
                      Puntos: {performance.points}, 
                      Bloqueos: {performance.blocks}, 
                      Aces: {performance.aces},
                      Recepciones: {performance.digs}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;