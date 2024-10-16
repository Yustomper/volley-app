import React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import MatchHeader from '../components/MatchHeader';
import EditMatchForm from '../components/EditMatchForm';
import MatchActions from '../components/MatchActions';
import StatisticsDisplay from '../components/StatisticsDisplay';
import useMatchDetails from '../hooks/useMatchDetails';
import useMatchEdit from '../hooks/useMatchEdit';
import api from '../services/matchesService';
import { useSnackbar } from 'notistack';

const MatchDetails = () => {
  const { isDarkMode } = useTheme();
  const { matchId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { match, loading, error, fetchMatchDetails } = useMatchDetails(matchId);
  const { 
    isEditing, 
    editedMatch, 
    handleEdit, 
    handleSaveEdit, 
    handleCancelEdit, 
    handleDelete, 
    handleStartMatch,
    handleInputChange,
    handleLocationSelect,
    locations
  } = useMatchEdit(match, fetchMatchDetails);

  // Cambios en handleRefreshWeather:
  // 1. Separamos la obtención del clima y la actualización en el backend en dos pasos distintos.
  // 2. Utilizamos await para cada operación asíncrona para manejar mejor los errores.
  // 3. Llamamos a fetchMatchDetails después de actualizar el clima para refrescar los datos del partido.
  const handleRefreshWeather = async () => {
    if (!match.latitude || !match.longitude) {
      enqueueSnackbar('No se pueden obtener las coordenadas del partido', { variant: 'warning' });
      return;
    }
    try {
      // Paso 1: Obtener los nuevos datos del clima
      const weatherData = await api.getWeather(match.latitude, match.longitude, match.date);
      
      // Paso 2: Actualizar el clima en el backend
      await api.updateMatchWeather(match.id, weatherData);
      
      // Paso 3: Refrescar los datos del partido
      await fetchMatchDetails();
      
      enqueueSnackbar('Clima actualizado con éxito', { variant: 'success' });
    } catch (error) {
      console.error('Error updating weather:', error);
      enqueueSnackbar('Error al actualizar el clima', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-8">
          {match && (
            <>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg relative mb-8">
                <MatchHeader 
                  match={match} 
                  isEditing={isEditing} 
                  editedMatch={editedMatch}
                  onInputChange={handleInputChange}
                  onLocationSelect={handleLocationSelect}
                  locations={locations}
                  onRefreshWeather={handleRefreshWeather}
                />
                {isEditing ? (
                  <EditMatchForm 
                    editedMatch={editedMatch}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    onInputChange={handleInputChange}
                  />
                ) : (
                  <MatchActions 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStartMatch={handleStartMatch}
                  />
                )}
              </div>
              {match.statistics && <StatisticsDisplay statistics={match.statistics} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;