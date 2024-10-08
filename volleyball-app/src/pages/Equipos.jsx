import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PlusIcon, PencilIcon, TrashIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import AddTeamModal from '../components/AddTeamModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EquiposSkeleton from '../components/skeletons/EquiposSkeleton';

export default function Equipos() {
  const { isDarkMode } = useTheme();
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6, total: 0 });
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchTeams();
  }, [search, orderBy, pagination.page]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.getTeams({
        page: pagination.page,
        search,
        ordering: `${orderBy}_${sortOrder}`,
      });
      setTeams(response.data.results);
      setPagination(prev => ({ ...prev, total: response.data.count }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (team) => {
    try {
      const response = await api.createTeam(team);
      setTeams([...teams, response.data]);
      setIsModalOpen(false);
      toast.success('¡Equipo creado correctamente!');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Error al crear el equipo. Verifica los requisitos.');
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
      toast.success('¡Equipo actualizado correctamente!');
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Error al actualizar el equipo.');
    }
  };

  const handleRemoveTeam = async (teamId) => {
    setConfirmModal({ isOpen: true, type: 'team', id: teamId });
  };

  const handleRemovePlayer = (teamId, playerId) => {
    setConfirmModal({ isOpen: true, type: 'player', id: playerId, teamId });
  };

  const handleConfirmRemove = async () => {
    try {
      if (confirmModal.type === 'team') {
        await api.deleteTeam(confirmModal.id);
        setTeams(teams.filter(team => team.id !== confirmModal.id));
        toast.success('¡Equipo eliminado correctamente!');
      } else if (confirmModal.type === 'player') {
        await api.removePlayerFromTeam(confirmModal.teamId, confirmModal.id);
        setTeams(teams.map(team => {
          if (team.id === confirmModal.teamId) {
            return {
              ...team,
              players: team.players.filter(player => player.id !== confirmModal.id)
            };
          }
          return team;
        }));
        toast.success('¡Jugador eliminado del equipo correctamente!');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error al eliminar.');
    }
    setConfirmModal({ isOpen: false, type: '', id: null });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleOrderBy = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const renderTeamsList = () => {
    if (loading) {
      return <EquiposSkeleton />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team.id} className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>{team.name}</h3>
              <ul className="space-y-3">
                {team.players.map((player) => (
                  <li key={player.id} className={`flex items-center justify-between space-x-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <img
                        src={player.avatar_url || '/api/placeholder/40/40'}
                        alt={player.name}
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                      />
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{player.name}</span>
                      <span className={isDarkMode ? 'text-purple-400' : 'text-orange-500'}>#{player.jersey_number}</span>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(team.id, player.id)}
                      className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-purple-600 hover:text-purple-700'} transition duration-300`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-purple-600 hover:text-purple-700'} transition duration-300`}
                  onClick={() => handleEditTeam(team)}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-purple-600 hover:text-purple-700'} transition duration-300`}
                  onClick={() => handleRemoveTeam(team.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No hay equipos disponibles.</p>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>Gestión de Equipos</h1>
          <button
            onClick={() => {
              setEditingTeam(null);
              setIsModalOpen(true);
            }}
            className={`${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-3 rounded-full transition duration-300 flex items-center`}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Equipo
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Buscar equipos..."
            className={`p-2 border rounded w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-orange-500
              ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'}`}
            value={search}
            onChange={handleSearch}
          />
          <button 
            onClick={handleOrderBy}
            className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} 
              px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            Ordenar: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        {renderTeamsList()}

        {/* Paginación */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''} 
              ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <span className={isDarkMode ? 'text-white' : 'text-black'}>
            Página {pagination.page} de {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
            className={`${pagination.page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''} 
              ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Modal para agregar/editar equipos */}
        <AddTeamModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTeam(null);
          }}
          onSubmit={editingTeam ? handleUpdateTeam : handleAddTeam}
          editingTeam={editingTeam}
        />

        {/* Modal de confirmación */}
        <ConfirmModal 
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, type: '', id: null })}
          onConfirm={handleConfirmRemove}
          title={confirmModal.type === 'team' ? 'Eliminar Equipo' : 'Eliminar Jugador'}
          message={confirmModal.type === 'team' ? '¿Estás seguro de que deseas eliminar este equipo?' : '¿Estás seguro de que deseas eliminar este jugador del equipo?'}
        />

        <ToastContainer />
      </div>
    </div>
  );
}