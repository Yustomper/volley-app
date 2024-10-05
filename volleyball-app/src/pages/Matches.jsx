import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { SearchIcon, FilterIcon, PlusIcon } from 'lucide-react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Matches = () => {
  const { isDarkMode } = useTheme();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [filterFinished, setFilterFinished] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6, total: 0 });

  useEffect(() => {
    fetchMatches();
  }, [search, orderBy, filterFinished, pagination.page]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        search,
        ordering: orderBy,
        ...(filterFinished !== 'all' && { is_finished: filterFinished === 'finished' })
      };
      const response = await api.getMatches(params);
      setMatches(response.data.results);
      setPagination(prev => ({ ...prev, total: response.data.count }));
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Error al cargar los partidos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleOrderBy = (field) => {
    setOrderBy(field);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (value) => {
    setFilterFinished(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const renderMatchesList = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <MatchSkeleton key={index} isDarkMode={isDarkMode} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
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
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No hay partidos disponibles.</p>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>Partidos</h1>
          <Link
            to="/create-match"
            className={`${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'} 
              text-white px-6 py-3 rounded-full transition duration-300 flex items-center`}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Partido
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar partidos..."
              className="pl-10 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={search}
              onChange={handleSearch}
              style={{ color: 'black' }}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={orderBy} 
              onChange={(e) => handleOrderBy(e.target.value)} 
              className="p-2 border rounded w-full md:w-auto"
              style={{ color: 'black' }}
            >
              <option value="date">Ordenar por fecha</option>
              <option value="-date">Ordenar por fecha (desc)</option>
              <option value="created_at">Ordenar por creación</option>
            </select>
            <select 
              value={filterFinished} 
              onChange={(e) => handleFilterChange(e.target.value)} 
              className="p-2 border rounded w-full md:w-auto"
              style={{ color: 'black' }}
            >
              <option value="all">Todos los partidos</option>
              <option value="finished">Finalizados</option>
              <option value="in_progress">En progreso</option>
            </select>
          </div>
        </div>

        {renderMatchesList()}

        {matches.length > 0 && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)} 
              disabled={pagination.page === 1 || loading} 
              className={`px-4 py-2 mx-2 border rounded transition duration-300 ${
                loading || pagination.page === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : isDarkMode 
                    ? 'hover:bg-purple-600' 
                    : 'hover:bg-orange-100'
              }`}
            >
              Anterior
            </button>
            <span className="px-4 py-2">
              Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button 
              onClick={() => handlePageChange(pagination.page + 1)} 
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize) || loading}
              className={`px-4 py-2 mx-2 border rounded transition duration-300 ${
                loading || pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                  ? 'opacity-50 cursor-not-allowed' 
                  : isDarkMode 
                    ? 'hover:bg-purple-600' 
                    : 'hover:bg-orange-100'
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

const MatchSkeleton = ({ isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
    <div className={`h-8 w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4 animate-pulse`}></div>
    <div className={`h-4 w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2 animate-pulse`}></div>
    <div className={`h-4 w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4 animate-pulse`}></div>
    <div className={`h-4 w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4 animate-pulse`}></div>
    <div className={`h-10 w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
  </div>
);

export default Matches;