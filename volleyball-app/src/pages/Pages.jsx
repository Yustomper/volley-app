import React, { useState } from 'react';
import MatchForm from '../components/MatchForm';

const Matches = () => {
  const [matches, setMatches] = useState([
    { id: 1, team1: 'Equipo A', team2: 'Equipo B', date: '2023-05-15', time: '18:00', status: 'Programado' },
    { id: 2, team1: 'Equipo C', team2: 'Equipo D', date: '2023-05-16', time: '19:30', status: 'En progreso' },
  ]);

  const startMatch = (id) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, status: 'En progreso' } : match
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Partidos
        </h1>
        <MatchForm />
        <div className="mt-8 grid gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-primary">{match.team1}</span>
                <span className="text-lg text-gray-400">vs</span>
                <span className="text-xl font-semibold text-secondary">{match.team2}</span>
              </div>
              <div className="mt-4 text-gray-300">
                <p>Fecha: {match.date}</p>
                <p>Hora: {match.time}</p>
                <p>Estado: {match.status}</p>
              </div>
              {match.status === 'Programado' && (
                <button
                  onClick={() => startMatch(match.id)}
                  className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-300"
                >
                  Iniciar Partido
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;