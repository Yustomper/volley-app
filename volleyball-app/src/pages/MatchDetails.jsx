import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiDayThunderstorm } from 'react-icons/wi';
import api from '../services/api';
import { weatherService } from '../services/weatherService';

const MatchDetails = () => {
  const { isDarkMode } = useTheme();
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      setWeatherError(null);
      
      const response = await api.getMatch(matchId);
      setMatch(response.data);
      
      console.log('Match data:', response.data);

      if (response.data.latitude && response.data.longitude) {
        try {
          const matchDate = new Date(response.data.date);
          const currentDate = new Date();
          let dateToUse;

          if (matchDate > currentDate) {
            // If the match is in the future, use the current date for weather
            dateToUse = currentDate;
          } else {
            // If the match is in the past, use the match date
            dateToUse = matchDate;
          }

          const weatherData = await weatherService.getWeather(
            response.data.latitude,
            response.data.longitude,
            dateToUse.toISOString()
          );
          setWeather(weatherData);
        } catch (weatherErr) {
          console.error('Error del clima:', weatherErr);
          setWeatherError(weatherErr.message);
        }
      } else {
        setWeatherError('No hay coordenadas disponibles para este partido');
      }
    } catch (error) {
      console.error('Error al cargar el partido:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherInfo = (weatherCode) => {
    const weatherInfo = {
      Clear: { icon: <WiDaySunny className="text-4xl" />, text: 'Despejado' },
      Cloudy: { icon: <WiCloudy className="text-4xl" />, text: 'Nublado' },
      Rainy: { icon: <WiRain className="text-4xl" />, text: 'Lluvia' },
      Snowy: { icon: <WiSnow className="text-4xl" />, text: 'Nieve' },
      Stormy: { icon: <WiDayThunderstorm className="text-4xl" />, text: 'Tormenta' }
    };
    return weatherInfo[weatherCode] || weatherInfo.Clear;
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {match && (
          <div className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} p-6 rounded-lg shadow-lg`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Datos del partido:</h3>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify({
                  location: match.location,
                  latitude: match.latitude,
                  longitude: match.longitude,
                  date: match.date
                }, null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-center w-1/3">
                <h2 className="text-3xl font-bold">{match.home_team.name}</h2>
              </div>
              <div className="text-center w-1/3">
                <div className={`text-5xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'} mb-2`}>
                  VS
                </div>
                <p className="text-lg">
                  {new Date(match.date).toLocaleString()}
                </p>
                <p className="text-lg mb-2">{match.location}</p>
                
                {weather ? (
                  <div className="flex items-center justify-center">
                    {getWeatherInfo(weather.weatherCode).icon}
                    <span className="ml-2">
                      {weather.temperature}°C - {getWeatherInfo(weather.weatherCode).text}
                    </span>
                  </div>
                ) : (
                  <div className="text-red-500">
                    {weatherError || 'No se pudo cargar el clima'}
                  </div>
                )}
              </div>
              <div className="text-center w-1/3">
                <h2 className="text-3xl font-bold">{match.away_team.name}</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;