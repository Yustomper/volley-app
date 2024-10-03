import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { weatherService } from '../services/weatherService';
import debounce from 'lodash/debounce';

const MatchForm = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState({
    home_team_id: '',
    away_team_id: '',
    date: '',
    location: '',
    latitude: null,
    longitude: null,
    is_finished: false,
  });
  const [teams, setTeams] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTeams();
    if (id) {
      fetchMatch();
    }
  }, [id]);

  const fetchTeams = async () => {
    try {
      const response = await api.getTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Error al cargar los equipos');
    }
  };

  const fetchMatch = async () => {
    try {
      const response = await api.getMatch(id);
      setMatch(response.data);
    } catch (error) {
      console.error('Error fetching match:', error);
      toast.error('Error al cargar el partido');
    }
  };

  const searchLocation = debounce(async (searchTerm) => {
    if (!searchTerm) {
      setLocationSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await weatherService.searchLocations(searchTerm);
      setLocationSuggestions(results.map(result => ({
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude
      })));
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleLocationChange = (e) => {
    const searchTerm = e.target.value;
    setMatch(prevMatch => ({
      ...prevMatch,
      location: searchTerm,
      latitude: null,
      longitude: null
    }));
    searchLocation(searchTerm);
  };

  const handleLocationSelect = (suggestion) => {
    setMatch(prevMatch => ({
      ...prevMatch,
      location: `${suggestion.name}, ${suggestion.country}`,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    }));
    setLocationSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMatch(prevMatch => ({
      ...prevMatch,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.updateMatch(id, match);
        toast.success('Partido actualizado correctamente');
      } else {
        await api.createMatch(match);
        toast.success('Partido creado correctamente');
      }
      setTimeout(() => {
        navigate('/matches');
      }, 1500);
    } catch (error) {
      toast.error('Error al guardar el partido');
      console.error('Error saving match:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>
          {id ? 'Editar Partido' : 'Crear Partido'}
        </h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="home_team_id" className="block mb-2">Equipo Local</label>
            <select
              id="home_team_id"
              name="home_team_id"
              value={match.home_team_id}
              onChange={handleChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            >
              <option value="">Seleccionar equipo local</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="away_team_id" className="block mb-2">Equipo Visitante</label>
            <select
              id="away_team_id"
              name="away_team_id"
              value={match.away_team_id}
              onChange={handleChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            >
              <option value="">Seleccionar equipo visitante</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block mb-2">Fecha y Hora</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={match.date}
              onChange={handleChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            />
          </div>
          
          <div className="mb-4 relative">
            <label htmlFor="location" className="block mb-2">Ubicación</label>
            <input
              type="text"
              id="location"
              name="location"
              value={match.location}
              onChange={handleLocationChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            />
            {isSearching && (
              <div className="absolute right-3 top-10">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
            {locationSuggestions.length > 0 && (
              <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                {locationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer ${
                      isDarkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    {suggestion.name}, {suggestion.country}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_finished"
                checked={match.is_finished}
                onChange={handleChange}
                className="mr-2"
              />
              Partido finalizado
            </label>
          </div>
          
          <button
            type="submit"
            className={`w-full p-2 rounded ${
              isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-pink-500 hover:bg-pink-600'
            } text-white transition duration-300`}
          >
            {id ? 'Actualizar Partido' : 'Crear Partido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchForm;