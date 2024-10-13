import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';

const PointTypeModal = ({ open, onClose, onPointTypeSelect }) => {
  const { isDarkMode } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 max-w-md w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>
            Seleccionar Tipo de Punto
          </h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-pink-500 hover:text-pink-700'}`}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => onPointTypeSelect('SPK')}
            className={`w-full p-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-500 hover:bg-pink-600'} text-white rounded-lg transition duration-300`}
          >
            Punto por Remate
          </button>
          <button
            onClick={() => onPointTypeSelect('BLK')}
            className={`w-full p-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-500 hover:bg-pink-600'} text-white rounded-lg transition duration-300`}
          >
            Punto por Bloqueo
          </button>
          <button
            onClick={() => onPointTypeSelect('ACE')}
            className={`w-full p-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-500 hover:bg-pink-600'} text-white rounded-lg transition duration-300`}
          >
            Punto por Saque Directo
          </button>
          <button
            onClick={() => onPointTypeSelect('ERR')}
            className={`w-full p-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-500 hover:bg-pink-600'} text-white rounded-lg transition duration-300`}
          >
            Error del Oponente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointTypeModal;
