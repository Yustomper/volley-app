import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const useTeams = () => useContext(TeamContext);

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);

  const addTeam = (team) => {
    setTeams([...teams, { ...team, _id: Date.now().toString() }]);
  };

  const removeTeam = (teamId) => {
    setTeams(teams.filter(team => team._id !== teamId));
  };

  return (
    <TeamContext.Provider value={{ teams, addTeam, removeTeam }}>
      {children}
    </TeamContext.Provider>
  );
};