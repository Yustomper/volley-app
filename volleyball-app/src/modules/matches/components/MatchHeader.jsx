import React from 'react';
import WeatherDisplay from './WeatherDisplay';

const MatchHeader = ({ 
  match, 
  isEditing, 
  editedMatch, 
  onInputChange, 
  onLocationChange,
  onLocationSelect, 
  locations,
  onRefreshWeather 
}) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Fecha y Hora</label>
          <input
            type="datetime-local"
            name="date"
            value={editedMatch.date}
            onChange={onInputChange}
            className="w-full p-2 rounded dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2">Ubicación</label>
          <input
            type="text"
            name="location"
            value={editedMatch.location}
            onChange={onLocationChange}
            className="w-full p-2 rounded dark:bg-gray-700"
          />
          {locations.length > 0 && (
            <div className="mt-1 bg-white dark:bg-gray-700 rounded shadow-lg">
              {locations.map(location => (
                <div
                  key={location.id || `${location.latitude}-${location.longitude}`}
                  onClick={() => onLocationSelect(location)}
                  className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {location.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-center w-1/3">
          <h2 className="text-3xl font-bold">{match.home_team.name}</h2>
        </div>
        <div className="text-center w-1/3">
          <div className="text-5xl font-bold text-orange-600 dark:text-purple-400 mb-2">
            VS
          </div>
          <p className="text-lg">
            {new Date(match.date).toLocaleString()}
          </p>
          <p className="text-lg mb-2">{match.location}</p>
        </div>
        <div className="text-center w-1/3">
          <h2 className="text-3xl font-bold">{match.away_team.name}</h2>
        </div>
      </div>
      {match.weather && (
        <div className="w-full flex justify-center">
          <WeatherDisplay 
            weather={{
              condition: match.weather.condition,
              temperature: match.weather.temperature
            }} 
            onRefresh={onRefreshWeather}
          />
        </div>
      )}
    </div>
  );
};

export default MatchHeader;