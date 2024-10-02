import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Statistics = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalTeams: 0,
    topScorer: { name: '', score: 0 },
    mostWins: { name: '', wins: 0 },
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 text-center ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
          Estadísticas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total de Partidos"
            value={stats.totalMatches}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Total de Equipos"
            value={stats.totalTeams}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Máximo Anotador"
            value={`${stats.topScorer.name} (${stats.topScorer.score} puntos)`}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Equipo con Más Victorias"
            value={`${stats.mostWins.name} (${stats.mostWins.wins} victorias)`}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, isDarkMode }) => (
  <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-orange-100'}`}>
    <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>{title}</h2>
    <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{value}</p>
  </div>
);

export default Statistics;