import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiDayThunderstorm
} from 'react-icons/wi';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlay, FaVolleyballBall, FaTrophy } from 'react-icons/fa';
import api from '../services/api';

const MatchDetails = () => {
  const { isDarkMode } = useTheme();
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const [state, setState] = useState({
    match: null,
    editedMatch: null,
    weather: null,
    weatherError: null,
    loading: true,
    error: null,
    isEditing: false,
    locations: [],
    statistics: null
  });

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [matchResponse, statsResponse] = await Promise.all([
        api.getMatch(matchId),
        api.getMatchStatistics(matchId)
      ]).catch(error => {
        console.error('Error en la petición:', error);
        throw error;
      });
      
      const matchData = matchResponse.data;
      const statsData = statsResponse.data;
      
      setState(prev => ({
        ...prev,
        match: matchData,
        editedMatch: {
          ...matchData,
          date: matchData.date.split('.')[0]
        },
        statistics: statsData,
        loading: false
      }));

      if (matchData.location) {
        try {
          const weatherData = await api.getWeather(matchData.location, matchData.date);
          setState(prev => ({ ...prev, weather: weatherData }));
        } catch (err) {
          console.error('Error del clima:', err);
          setState(prev => ({ ...prev, weatherError: 'No se pudo obtener el clima' }));
        }
      }
    } catch (err) {
      console.error('Error al cargar el partido:', err);
      setState(prev => ({
        ...prev,
        error: 'No se pudo cargar la información del partido',
        loading: false
      }));
    }
  };

  const handleEdit = () => setState(prev => ({ ...prev, isEditing: true }));

  const handleCancelEdit = () => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      editedMatch: {
        ...prev.match,
        date: prev.match.date.split('.')[0]
      },
      locations: []
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      await api.updateMatch(matchId, {
        ...state.editedMatch,
        home_team: state.editedMatch.home_team.id,
        away_team: state.editedMatch.away_team.id,
      });
      
      setState(prev => ({ ...prev, isEditing: false }));
      await fetchMatchDetails();
    } catch (err) {
      console.error('Error al actualizar el partido:', err);
      setState(prev => ({
        ...prev,
        error: 'Error al guardar los cambios',
        loading: false
      }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este partido?')) {
      try {
        await api.deleteMatch(matchId);
        navigate('/matches');
      } catch (err) {
        console.error('Error al eliminar el partido:', err);
        setState(prev => ({
          ...prev,
          error: 'Error al eliminar el partido'
        }));
      }
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    setState(prev => ({
      ...prev,
      editedMatch: { ...prev.editedMatch, [name]: value }
    }));

    if (name === 'location') {
      try {
        const results = await api.searchLocations(value);
        setState(prev => ({ ...prev, locations: results }));
      } catch (err) {
        console.error('Error al buscar ubicaciones:', err);
      }
    }
  };

  const handleLocationSelect = (location) => {
    setState(prev => ({
      ...prev,
      editedMatch: {
        ...prev.editedMatch,
        location: location.name,
        latitude: location.latitude,
        longitude: location.longitude
      },
      locations: []
    }));
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: WiDaySunny,
      Cloudy: WiCloudy,
      Rainy: WiRain,
      Snowy: WiSnow,
      Stormy: WiDayThunderstorm
    };
    const IconComponent = icons[condition] || WiDaySunny;
    return <IconComponent className="text-4xl" />;
  };

  const handleStartMatch = () => {
    navigate(`/volleyball/${matchId}`);
  };

  const StatisticCard = ({ title, icon, children, isEmpty }) => (
    <div className={`mb-8 p-6 rounded-lg shadow-lg ${isEmpty ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      {children}
    </div>
  );

  const renderPlayerStats = (player, title, icon) => {
    if (!player) {
      return (
        <StatisticCard title={title} icon={icon} isEmpty={true}>
          <p className="text-gray-500">No hay datos disponibles</p>
        </StatisticCard>
      );
    }

    return (
      <StatisticCard title={title} icon={icon}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Nombre:</p>
            <p>{player.name}</p>
          </div>
          <div>
            <p className="font-semibold">Número de camiseta:</p>
            <p>{player.jersey_number}</p>
          </div>
          <div>
            <p className="font-semibold">Posición:</p>
            <p>{player.position}</p>
          </div>
          <div>
            <p className="font-semibold">Total de puntos:</p>
            <p>{player.total_points}</p>
          </div>
        </div>
        {title === "Mejor Anotador" && (
          <div>
            <p className="font-semibold">Ataques realizados:</p>
            <p>{player.spike_attempts}</p>
          </div>
        )}
        {title === "Mejor Sacador" && (
          <div>
            <p className="font-semibold">Total de aces:</p>
            <p>{player.total_aces}</p>
          </div>
        )}
        <div className="mt-4">
          <p className="font-semibold mb-2">Puntos por Set:</p>
          {player.points_per_set && player.points_per_set.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {player.points_per_set.map((set, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <p className="font-medium">Set {set.set__set_number}</p>
                  <p>{set.points} puntos</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay datos de sets disponibles</p>
          )}
        </div>
      </StatisticCard>
    );
  };

  const renderStatistics = () => {
    const { statistics } = state;

    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPlayerStats(
          statistics?.best_scorer,
          "Mejor Anotador",
          <FaVolleyballBall className="text-2xl text-orange-500" />
        )}
        {renderPlayerStats(
          statistics?.best_server,
          "Mejor Sacador",
          <FaTrophy className="text-2xl text-yellow-500" />
        )}
        {statistics?.sets && statistics.sets.length > 0 && (
          <div className="md:col-span-2">
            <StatisticCard 
              title="Resultados por Set" 
              icon={<FaVolleyballBall className="text-2xl text-blue-500" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statistics.sets.map((set, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Set {set.set_number}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{state.match?.home_team.name}</p>
                        <p className="text-lg">{set.home_team_score}</p>
                      </div>
                      <div>
                        <p className="font-medium">{state.match?.away_team.name}</p>
                        <p className="text-lg">{set.away_team_score}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StatisticCard>
          </div>
        )}
      </div>
    );
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (state.error) {
    return <div className="text-red-500 text-center p-4">{state.error}</div>;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-8">
          {state.match && (
            <>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg relative mb-8">
                <div className="absolute top-4 right-4 space-x-2">
                  {state.isEditing ? (
                    <>
                      <button 
                        onClick={handleSaveEdit} 
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                      >
                        <FaSave />
                      </button>
                      <button 
                        onClick={handleCancelEdit} 
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleEdit} 
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={handleDelete} 
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                      <button 
                        onClick={handleStartMatch} 
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                      >
                        <FaPlay className="inline mr-1" /> Iniciar Partido
                      </button>
                    </>
                  )}
                </div>

                {state.isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={state.editedMatch.date}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Ubicación</label>
                      <input
                        type="text"
                        name="location"
                        value={state.editedMatch.location}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded dark:bg-gray-700"
                      />
                      {state.locations.length > 0 && (
                        <div className="mt-1 bg-white dark:bg-gray-700 rounded shadow-lg">
                          {state.locations.map(location => (
                            <div
                              key={location.id || `${location.latitude}-${location.longitude}`}
                              onClick={() => handleLocationSelect(location)}
                              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              {location.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="text-center w-1/3">
                      <h2 className="text-3xl font-bold">{state.match.home_team.name}</h2>
                    </div>
                    <div className="text-center w-1/3">
                      <div className="text-5xl font-bold text-orange-600 dark:text-purple-400 mb-2">
                        VS
                      </div>
                      <p className="text-lg">
                        {new Date(state.match.date).toLocaleString()}
                      </p>
                      <p className="text-lg  mb-2">{state.match.location}</p>
                      
                      {state.weather ? (
                        <div className="flex items-center justify-center">
                          {getWeatherIcon(state.weather.condition)}
                          <span className="ml-2">{state.weather.temperature}°C</span>
                        </div>
                      ) : state.weatherError ? (
                        <p className="text-red-500">{state.weatherError}</p>
                      ) : null}
                    </div>
                    <div className="text-center w-1/3">
                      <h2 className="text-3xl font-bold">{state.match.away_team.name}</h2>
                    </div>
                  </div>
                )}
              </div>
              
              {renderStatistics()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;