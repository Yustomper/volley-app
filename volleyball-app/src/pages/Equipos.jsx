import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import AddTeamModal from '../components/AddTeamModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Equipos = () => {
  const { isDarkMode } = useTheme();
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.getTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleAddTeam = async (team) => {
    try {
      const response = await api.createTeam(team);
      setTeams([...teams, response.data]);
      setIsModalOpen(false);
      toast.success('¡Equipo creado correctamente!'); // Muestra un toast de éxito
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Error al crear el equipo. Verifica los requisitos.'); // Muestra un toast de error
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleUpdateTeam = async (updatedTeam) => {
    try {
      const response = await api.updateTeam(updatedTeam.id, updatedTeam);
      setTeams(teams.map(team => team.id === updatedTeam.id ? response.data : team));
      setIsModalOpen(false);
      setEditingTeam(null);
      toast.success('¡Equipo actualizado correctamente!'); // Muestra un toast de éxito
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Error al actualizar el equipo.'); // Muestra un toast de error
    }
  };

  const handleRemoveTeam = async (teamId) => {
    setConfirmModal({ isOpen: true, type: 'team', id: teamId });
  };

  const handleRemovePlayer = async (teamId, playerId) => {
    setConfirmModal({ isOpen: true, type: 'player', id: playerId, teamId: teamId });
  };

  const handleConfirmRemove = async () => {
    try {
      if (confirmModal.type === 'team') {
        await api.deleteTeam(confirmModal.id);
        setTeams(teams.filter(team => team.id !== confirmModal.id));
        toast.success('¡Equipo eliminado correctamente!'); // Muestra un toast de éxito
      } else if (confirmModal.type === 'player') {
        const team = teams.find(t => t.id === confirmModal.teamId);
        const updatedPlayers = team.players.filter(p => p.id !== confirmModal.id);
        await api.updateTeam(confirmModal.teamId, { ...team, players: updatedPlayers });
        setTeams(teams.map(t => t.id === confirmModal.teamId ? { ...t, players: updatedPlayers } : t));
        toast.success('¡Jugador eliminado correctamente!'); // Muestra un toast de éxito
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error al eliminar.'); // Muestra un toast de error
    }
    setConfirmModal({ isOpen: false, type: '', id: null });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Gestión de Equipos</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-3 rounded-full transition duration-300 flex items-center`}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Equipo
          </button>
        </div>

        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-orange-300' : 'text-orange-500'}`}>Equipos Registrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <div key={team.id} className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{team.name}</h3>
              <ul className="space-y-3">
                {team.players.map((player) => (
                  <li key={player.id} className={`flex items-center justify-between space-x-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <img
                        src={player.avatar_url || '/placeholder.svg?height=40&width=40'}
                        alt={player.name}
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                      />
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{player.name}</span>
                      <span className={isDarkMode ? 'text-orange-400' : 'text-orange-500'}>#{player.jersey_number}</span>
                    </div>
                    <button 
                      onClick={() => handleRemovePlayer(team.id, player.id)}
                      className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-orange-600 hover:text-orange-700'} transition duration-300`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end space-x-2">
                <button 
                  className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-orange-600 hover:text-orange-700'} transition duration-300`}
                  onClick={() => handleEditTeam(team)}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button 
                  className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-orange-600 hover:text-orange-700'} transition duration-300`}
                  onClick={() => handleRemoveTeam(team.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTeamModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
        }}
        onSubmit={editingTeam ? handleUpdateTeam : handleAddTeam}
        editingTeam={editingTeam}
        isDarkMode={isDarkMode} // Pasar el estado del modo oscuro
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', id: null })}
        onConfirm={handleConfirmRemove}
        type={confirmModal.type}
      />

      <ToastContainer />
    </div>
  );
};

export default Equipos;
