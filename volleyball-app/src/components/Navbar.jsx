'use client'

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { token, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold mr-4">
              Volleyball App
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
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
          <div className="md:hidden flex items-center">
            <button onClick={toggleTheme} className="mr-4">
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {token ? (
              <>
                <Link to="/equipos" className="block px-3 py-2 rounded-md text-base font-medium">Equipos</Link>
                <Link to="/matches" className="block px-3 py-2 rounded-md text-base font-medium">Partidos</Link>
                <Link to="/statistics" className="block px-3 py-2 rounded-md text-base font-medium">Estadísticas</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium">Iniciar sesión</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}