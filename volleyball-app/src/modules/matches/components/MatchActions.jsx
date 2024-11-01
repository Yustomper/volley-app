import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlay } from 'react-icons/fa';

const MatchActions = ({ onEdit, onDelete, matchId }) => {
  const navigate = useNavigate();

  const handleStartMatch = () => {
    navigate(`/volleyball/${matchId}`); 
  };

  return (
    <div className="absolute top-4 right-4 space-x-2">
      <button 
        onClick={onEdit} 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaEdit />
      </button>
      <button 
        onClick={onDelete} 
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
    </div>
  );
};

export default MatchActions;