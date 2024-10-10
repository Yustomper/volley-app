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
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlay } from 'react-icons/fa';  // FaPlay para el nuevo botón
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
    locations: []
  });

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await api.getMatch(matchId);
      const matchData = response.data;
      
      setState(prev => ({
        ...prev,
        match: matchData,
        editedMatch: {
          ...matchData,
          date: matchData.date.split('.')[0]
        },
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

  // Nuevo manejador para el botón de iniciar partido
  const handleStartMatch = () => {
    navigate(`/start-match/${matchId}`);
  };

  if (state.loading) {
    return <div>Cargando...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-8">
          {state.match && (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
              <div className="absolute top-4 right-4 space-x-2">
                {state.isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} className="bg-green-500 text-white p-2 rounded">
                      <FaSave />
                    </button>
                    <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-2 rounded">
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEdit} className="bg-blue-500 text-white p-2 rounded">
                      <FaEdit />
                    </button>
                    <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
                      <FaTrash />
                    </button>
                    {/* Nuevo botón para iniciar partido */}
                    <button onClick={handleStartMatch} className="bg-yellow-500 text-white p-2 rounded">
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
                      <div className="mt-1">
                        {state.locations.map(location => (
                          <div
                            key={location.id || `${location.latitude}-${location.longitude}`}
                            onClick={() => handleLocationSelect(location)}
                            className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
