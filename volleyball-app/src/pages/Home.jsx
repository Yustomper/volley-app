// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';


const Home = () => {
  const { isDarkMode } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    '/images/volley1.jpg',
    '/images/volley2.png',
    '/images/volley3.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        // URL directa al backend
        await fetch(import.meta.env.VITE_BACKEND_API, {
          method: 'GET'
        });
        console.log('Petición al backend enviada para despertarlo.');
      } catch (error) {
        console.error('Error despertando el backend:', error);
      }
    };

    wakeUpBackend();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-12">
        <h1 className={`text-4xl font-bold mb-8 text-center ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
          Bienvenido a la App de Voleibol
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>Sobre el Voleibol</h2>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              El voleibol es un deporte de equipo emocionante y dinámico que se juega entre dos equipos de seis jugadores cada uno. 
              El objetivo es enviar el balón por encima de la red al campo contrario y evitar que toque el suelo en el propio campo.
            </p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>Build Recruiting</h2>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nuestra función "Build Recruiting" te permite crear y gestionar equipos de voleibol de manera eficiente. 
              Puedes agregar jugadores, asignar números de camiseta y roles, y mantener un seguimiento de tu plantilla.
            </p>
            <Link 
              to="/equipos" 
              className={`inline-block px-6 py-3 rounded-full ${
                isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'
              } text-white transition duration-300`}
            >
              Comenzar a Reclutar
            </Link>
          </div>
        </div>
        
        <div className="mb-12 flex flex-col items-center">
          <div className="relative w-full max-w-4xl h-96 overflow-hidden rounded-xl">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Volleyball ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="flex mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === currentSlide
                    ? isDarkMode
                      ? 'bg-purple-400'
                      : 'bg-orange-600'
                    : isDarkMode
                    ? 'bg-gray-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;