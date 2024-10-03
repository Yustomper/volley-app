import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';  // Importa los iconos que necesites
import api from '../services/api';

const MatchDetails = () => {
  const { isDarkMode } = useTheme();
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await api.getMatch(matchId);
        setMatch(response.data);
        fetchWeather(response.data.location, response.data.date);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const fetchWeather = async (location, date) => {
    try {
      const response = await api.getWeather(location, date);
      const translatedCondition = translateWeatherCondition(response.condition);
      setWeather({ ...response, condition: translatedCondition });
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const translateWeatherCondition = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return { text: 'Soleado', icon: <WiDaySunny className="inline-block text-2xl" /> };
      case 'cloudy':
        return { text: 'Nublado', icon: <WiCloudy className="inline-block text-2xl" /> };
      case 'rainy':
        return { text: 'Lluvioso', icon: <WiRain className="inline-block text-2xl" /> };
      case 'snowy':
        return { text: 'Nevado', icon: <WiSnow className="inline-block text-2xl" /> };
      default:
        return { text: condition, icon: null };
    }
  };

  if (!match) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Cargando...</div>;
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
                {match.home_team_score} : {match.away_team_score}
              </h1>
              <p className="text-lg mt-2">
                {new Date(match.date).toLocaleDateString()} - {match.location}
              </p>
              {weather && (
                <p className="text-lg mt-1 flex items-center justify-center">
                  {weather.icon} {weather.temperature}°C, {weather.condition.text}
                </p>
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
        </div>

        {/* Sección de estadísticas de jugadores */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
              {match.home_team.name} - Estadísticas
            </h3>
            {match.home_team.players.map(player => (
              <div key={player.id} className={`mb-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className="font-semibold">{player.name}</p>
                <p>Puntos: {player.points}, Bloqueos: {player.blocks}, Aces: {player.aces}, Recepciones: {player.receptions}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
              {match.away_team.name} - Estadísticas
            </h3>
            {match.away_team.players.map(player => (
              <div key={player.id} className={`mb-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className="font-semibold">{player.name}</p>
                <p>Puntos: {player.points}, Bloqueos: {player.blocks}, Aces: {player.aces}, Recepciones: {player.receptions}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
