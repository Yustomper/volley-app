import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

const MatchForm = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [match, setMatch] = useState({
    home_team_id: '',
    away_team_id: '',
    date: '',
    time: '',
    location: '',
    latitude: null,
    longitude: null, // Guardamos las coordenadas seleccionadas
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.getTeams();
      setTeams(response.data.results || []);
    } catch (error) {
      console.error('Error al cargar los equipos:', error);
      toast.error('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatch({ ...match, [name]: value });

    if (name === 'location') {
      debouncedSearchLocations(value);
    }
  };

  const debouncedSearchLocations = debounce(async (query) => {
    if (query.length > 2) {
      const results = await api.searchLocations(query);  // Aquí usamos la función de búsqueda
      setLocations(results);
    } else {
      setLocations([]);
    }
  }, 300);

  const handleLocationSelect = (location) => {
    setMatch({
      ...match,
      location: location.name,  // Guardamos la ubicación seleccionada
      latitude: location.latitude,  // Guardamos latitud
      longitude: location.longitude,  // Guardamos longitud
    });
    setLocations([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const matchData = {
        ...match,
        date: `${match.date}T${match.time}`,  // Combinamos fecha y hora
      };
      delete matchData.time;
      await api.createMatch(matchData);  // Creamos el partido con las coordenadas
      toast.success('Partido creado exitosamente');
      navigate('/matches');
    } catch (error) {
      console.error('Error al crear el partido:', error);
      toast.error('Error al crear el partido');
    }
  };

  if (loading) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} flex items-center justify-center`}>Cargando...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>Crear Partido</h1>
        <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="home_team_id"
              value={match.home_team_id}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              required
            >
              <option value="">Seleccionar Equipo Local</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <select
              name="away_team_id"
              value={match.away_team_id}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              required
            >
              <option value="">Seleccionar Equipo Visitante</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={match.date}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              required
            />
            <input
              type="time"
              name="time"
              value={match.time}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              required
            />
            <div className="relative">
              <input
                type="text"
                name="location"
                value={match.location}
                onChange={handleChange}
                placeholder="Ubicación"
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                required
              />
              {locations.length > 0 && (
                <ul className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  {locations.map((loc) => (
                    <li
                      key={`${loc.latitude}-${loc.longitude}`}
                      onClick={() => handleLocationSelect(loc)}
                      className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      {loc.name}, {loc.country}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            type="submit"
            className={`mt-4 w-full p-2 rounded-lg ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'} text-white transition duration-300`}
          >
            Crear Partido
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchForm;
