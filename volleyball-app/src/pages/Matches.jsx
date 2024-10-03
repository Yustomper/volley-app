import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Matches = () => {
  const { isDarkMode } = useTheme();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>Partidos</h1>
          <Link
            to="/create-match"
            className={`${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-3 rounded-full transition duration-300`}
          >
            Crear Partido
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div key={match.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
              {/* Asegúrate de que la API devuelve estos nombres como home_team.name y away_team.name */}
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
                {match.home_team?.name} vs {match.away_team?.name}
              </h3>
              <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Fecha: {new Date(match.date).toLocaleString()}
              </p>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ubicación: {match.location}
              </p>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Estado: {match.is_finished ? 'Finalizado' : 'En progreso'}
              </p>
              <Link
                to={`/match-details/${match.id}`}
                className={`inline-block px-4 py-2 rounded ${
                  isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'
                } text-white transition duration-300`}
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
