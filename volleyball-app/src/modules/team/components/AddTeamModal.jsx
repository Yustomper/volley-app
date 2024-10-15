import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../../context/ThemeContext';
import { Switch } from '@headlessui/react';

const POSITION_OPTIONS = [
  { value: 'CE', label: 'Central' },
  { value: 'PR', label: 'Punta Receptor' },
  { value: 'AR', label: 'Armador' },
  { value: 'OP', label: 'Opuesto' },
  { value: 'LI', label: 'Líbero' },
];

const AddTeamModal = ({ open, onClose, onSubmit, editingTeam }) => {
  const { isDarkMode } = useTheme();
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([{ name: '', jerseyNumber: '', avatarUrl: '', position: '', isHolding: false }]);

  useEffect(() => {
    if (editingTeam) {
      setTeamName(editingTeam.name);
      setPlayers(editingTeam.players.map(player => ({
        name: player.name,
        jerseyNumber: player.jersey_number,
        avatarUrl: player.avatar_url,
        position: player.position || '',
        isHolding: player.is_holding || false,
      })));
    } else {
      setTeamName('');
      setPlayers([{ name: '', jerseyNumber: '', avatarUrl: '', position: '', isHolding: false }]);
    }
  }, [editingTeam]);

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    if (players.length < 12) {
      setPlayers([...players, { name: '', jerseyNumber: '', avatarUrl: '', position: '', isHolding: false }]);
    }
  };

  const handleRemovePlayer = (index) => {
    if (players.length > 5) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const handleSubmit = () => {
    if (teamName && players.length >= 6 && players.every(player => player.name && player.jerseyNumber)) {
      onSubmit({
        id: editingTeam?.id,
        name: teamName,
        players: players.map(player => ({
          name: player.name,
          jersey_number: player.jerseyNumber,
          avatar_url: player.avatarUrl,
          position: player.position,
          is_holding: player.isHolding,
        }))
      });
      onClose();
    } else {
      alert('Por favor, completa todos los campos obligatorios y asegúrate de tener al menos 6 jugadores');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 max-w-2xl w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>
            {editingTeam ? 'Editar Equipo' : 'Agregar Equipo'}
          </h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-pink-500 hover:text-pink-700'}`}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Nombre del Equipo"
          className={`w-full p-2 mb-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-pink-100 text-pink-800'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-300'} rounded-lg focus:outline-none focus:border-purple-500`}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        {players.map((player, index) => (
          <div key={index} className="flex mb-4 space-x-2 items-center">
            <input
              type="text"
              placeholder="Nombre del Jugador"
              className={`flex-grow p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-pink-100 text-pink-800'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              value={player.name}
              onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Número"
              className={`w-16 p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-pink-100 text-pink-800'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              value={player.jerseyNumber}
              onChange={(e) => handlePlayerChange(index, 'jerseyNumber', e.target.value)}
            />
            <input
              type="text"
              placeholder="URL Avatar"
              className={`flex-grow p-2 w-28 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-pink-100 text-pink-800'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              value={player.avatarUrl}
              onChange={(e) => handlePlayerChange(index, 'avatarUrl', e.target.value)}
            />
            <select
              value={player.position}
              onChange={(e) => handlePlayerChange(index, 'position', e.target.value)}
              className={`w-24 p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-pink-100 text-pink-800'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-300'} rounded-lg focus:outline-none focus:border-purple-500`}
            >
              <option value="">Posición</option>
              {POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Switch
              checked={player.isHolding}
              onChange={(checked) => handlePlayerChange(index, 'isHolding', checked)}
              className={`${
                player.isHolding ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Titular</span>
              <span
                className={`${
                  player.isHolding ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <button onClick={() => handleRemovePlayer(index)} className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-pink-600 hover:text-pink-700'}`}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddPlayer}
          className={`w-full p-2 mb-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-500 hover:bg-pink-600'} text-white rounded-lg transition duration-300 flex items-center justify-center`}
          disabled={players.length >= 12}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Jugador
        </button>
        <button
          onClick={handleSubmit}
          className={`w-full p-2 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-pink-600 hover:bg-pink-700'} text-white rounded-lg transition duration-300`}
        >
          {editingTeam ? 'Actualizar Equipo' : 'Guardar Equipo'}
        </button>
      </div>
    </div>
  );
};

export default AddTeamModal;