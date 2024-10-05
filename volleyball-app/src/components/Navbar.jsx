import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { token, user, logout } = useAuth();

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold mr-4">
              Volleyball App
            </Link>
            {token && (
              <span className="text-sm font-medium">
                Bienvenido, {user?.username || 'Usuario'}
              </span>
            )}
          </div>
          <div className="flex items-center">
            {token ? (
              <>
                <Link to="/equipos" className="px-3 py-2 rounded-md text-sm font-medium">Equipos</Link>
                <Link to="/matches" className="px-3 py-2 rounded-md text-sm font-medium">Partidos</Link>
                <Link to="/statistics" className="px-3 py-2 rounded-md text-sm font-medium">Estadísticas</Link>
                <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium">Iniciar sesión</Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium">Registrarse</Link>
              </>
            )}
            <button onClick={toggleTheme} className="ml-4">
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;