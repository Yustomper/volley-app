import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import api from '../services/api'; // Importa el servicio api

const Login = () => {
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.login(formData);
      const { token } = response.data;
      
      await login(token);
      toast.success('Inicio de sesión exitoso');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || 'Error en el inicio de sesión');
      } else if (error.request) {
        toast.error('No se pudo conectar con el servidor');
      } else {
        toast.error('Error al procesar la solicitud');
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-xl shadow-md`}>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
          Iniciar Sesión
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <input
              type="text"
              name="username_or_email"
              placeholder="Nombre de usuario o correo electrónico"
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} placeholder-gray-500 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10`}
              value={formData.username_or_email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} placeholder-gray-500 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 mt-2`}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;