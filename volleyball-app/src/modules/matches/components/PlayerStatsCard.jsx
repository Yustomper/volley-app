import React from 'react';

const PlayerStatsCard = ({ player, title, icon }) => {
  if (!player) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="text-xl font-semibold ml-2">{title}</h3>
        </div>
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-semibold">Nombre:</p>
          <p>{player.name}</p>
        </div>
        <div>
          <p className="font-semibold">Número de camiseta:</p>
          <p>{player.jersey_number}</p>
        </div>
        <div>
          <p className="font-semibold">Posición:</p>
          <p>{player.position}</p>
        </div>
        <div>
          <p className="font-semibold">Total de puntos:</p>
          <p>{player.total_points}</p>
        </div>
      </div>
      {title === "Mejor Anotador" && (
        <div>
          <p className="font-semibold">Ataques realizados:</p>
          <p>{player.spike_attempts}</p>
        </div>
      )}
      {title === "Mejor Sacador" && (
        <div>
          <p className="font-semibold">Total de aces:</p>
          <p>{player.total_aces}</p>
        </div>
      )}
      <div className="mt-4">
        <p className="font-semibold mb-2">Puntos por Set:</p>
        {player.points_per_set && player.points_per_set.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {player.points_per_set.map((set, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <p className="font-medium">Set {set.set__set_number}</p>
                <p>{set.points} puntos</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay datos de sets disponibles</p>
        )}
      </div>
    </div>
  );
};

export default PlayerStatsCard;