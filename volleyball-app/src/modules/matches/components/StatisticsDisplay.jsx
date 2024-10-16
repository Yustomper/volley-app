import React from 'react';
import { FaVolleyballBall, FaTrophy } from 'react-icons/fa';
import PlayerStatsCard from './PlayerStatsCard';

const StatisticsDisplay = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlayerStatsCard
        player={statistics.best_scorer}
        title="Mejor Anotador"
        icon={<FaVolleyballBall className="text-2xl text-orange-500" />}
      />
      <PlayerStatsCard
        player={statistics.best_server}
        title="Mejor Sacador"
        icon={<FaTrophy className="text-2xl text-yellow-500" />}
      />
      {statistics.sets && statistics.sets.length > 0 && (
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FaVolleyballBall className="text-2xl text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Resultados por Set</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.sets.map((set, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Set {set.set_number}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{set.home_team_name}</p>
                      <p className="text-lg">{set.home_team_score}</p>
                    </div>
                    <div>
                      <p className="font-medium">{set.away_team_name}</p>
                      <p className="text-lg">{set.away_team_score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsDisplay;