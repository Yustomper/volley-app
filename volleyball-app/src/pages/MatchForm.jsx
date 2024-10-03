import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

const MatchForm = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState({
    home_team_id: '',
    away_team_id: '',
    date: '',
    location: '',
    is_finished: false,
  });
  const [teams, setTeams] = useState([]); // Inicializa teams como un array vacío

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
    }
  };

  const fetchMatch = async () => {
    try {
      const response = await api.getMatch(id);
      setMatch(response.data);
    } catch (error) {
      console.error('Error fetching match:', error);
    }
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
      }, 1500);  // Espera un momento antes de redirigir para que el toast se vea
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
            <label htmlFor="home_team_id" className="block mb-2">Equipo 1</label>
            <select
              id="home_team_id"
              name="home_team_id"
              value={match.home_team_id}
              onChange={handleChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            >
              <option value="">Seleccionar equipo 1</option>
              {Array.isArray(teams) && teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="away_team_id" className="block mb-2">Equipo 2</label>
            <select
              id="away_team_id"
              name="away_team_id"
              value={match.away_team_id}
              onChange={handleChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            >
              <option value="">Seleccionar equipo 2</option>
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
          <div className="mb-4">
            <label htmlFor="location" className="block mb-2">Ubicación</label>
            <input
              type="text"
              id="location"
              name="location"
              value={match.location}
              onChange={handleChange}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              required
            />
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
