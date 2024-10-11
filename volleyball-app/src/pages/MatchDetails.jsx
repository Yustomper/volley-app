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
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlay } from 'react-icons/fa';
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

  const renderStatistics = () => {
    if (!state.statistics) return null;

    const { best_scorer, best_server, sets } = state.statistics;

    return (
      <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Estadísticas del Partido</h2>
        
        {best_scorer && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Mejor Anotador</h3>
            <p>Nombre: {best_scorer.name}</p>
            <p>Número: {best_scorer.jersey_number}</p>
            <p>Posición: {best_scorer.position}</p>
            <p>Total de puntos: {best_scorer.total_points}</p>
            <p>Ataques realizados: {best_scorer.spike_attempts}</p>
            {best_scorer.points_per_set && best_scorer.points_per_set.length > 0 && (
              <>
                <h4 className="font-semibold mt-2">Puntos por set:</h4>
                <ul>
                  {best_scorer.points_per_set.map((set, index) => (
                    <li key={index}>Set {set.set__set_number}: {set.points} puntos</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {best_server && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Mejor Sacador</h3>
            <p>Nombre: {best_server.name}</p>
            <p>Número: {best_server.jersey_number}</p>
            <p>Posición: {best_server.position}</p>
            <p>Total de aces: {best_server.total_aces}</p>
            {best_server.points_per_set && best_server.points_per_set.length > 0 && (
              <>
                <h4 className="font-semibold mt-2">Puntos por set:</h4>
                <ul>
                  {best_server.points_per_set.map((set, index) => (
                    <li key={index}>Set {set.set__set_number}: {set.points} puntos</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {sets && sets.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Resultados por Set</h3>
            {sets.map((set, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-semibold mb-2">Set {set.set_number}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">{state.match?.home_team.name}</h5>
                    <p>Puntos: {set.home_team_score}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">{state.match?.away_team.name}</h5>
                    <p>Puntos: {set.away_team_score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (state.loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
    </div>;
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
                        <FaPlay /> Iniciar Partido
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
                      <p className="text-lg mb-2">{state.match.location}</p>
                      
                      {state.weather ? (
                        <div className="flex items-center justify-center">
                          {getWeatherIcon(state.weather.condition)}
                          <span className="ml-2">
                            {state.weather.temperature}°C
                          </span>
                        </div>
                      ) : (
                        <div className="text-red-500">
                          {state.weatherError || 'No se pudo cargar el clima'}
                        </div>
                      )}
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