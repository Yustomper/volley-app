// src/pages/MatchForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const MatchForm = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState({
    home_team: '',
    away_team: '',
    date: '',
    location: '',
    is_finished: false,
  });
  const [teams, setTeams] = useState([]);

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
      } else {
        await api.createMatch(match);
      }
      navigate('/matches');
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>
          {id ? 'Editar Partido' : 'Crear Partido'}
        </h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="home_team" className="block mb-2">Equipo Local</label>
            <select
              id="home_team"
              name="home_team"
              value={match.home_team}
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
            <label htmlFor="away_team" className="block mb-2">Equipo Visitante</label>
            <select
              id="away_team"
              name="away_team"
              value={match.away_team}
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