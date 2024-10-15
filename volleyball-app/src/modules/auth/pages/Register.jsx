import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../../context/ThemeContext';
import {useRegister} from '../hooks/useRegister';
import {RegisterForm} from '../components/RegisterForm';

const Register = () => {
  const { username, email, password, confirmPassword, 
    setUsername, setEmail, setPassword, setConfirmPassword } = useRegister();
  const { isDarkMode } = useTheme(); 

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-xl shadow-md`}>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-purple-400' : 'text-orange-600'}`}>
          Registrarse
        </h2>
         <RegisterForm
          username={username}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          setUsername={setUsername}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          handleSubmit={useRegister}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Register;
