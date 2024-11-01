import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStop, FaPlay, FaForward } from 'react-icons/fa';
import matchesService from '../services/matchesService';
import MatchControlHeader from '../components/MatchControlHeader';
import CourtControl from '../components/CourtControl';

const MatchControl = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState({
    home_team: { name: '', players: [] },
    away_team: { name: '', players: [] },
    home_score: 0,
    away_score: 0,
    home_positions: Array(6).fill(null),
    away_positions: Array(6).fill(null),
    status: 'pending',
    current_set: 1,
    current_set_started: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await matchesService.getMatch(matchId);
      if (response && response.data) {
        const matchData = response.data;
        
        // Filtra los jugadores titulares (is_holding=true) para ambos equipos
        const homePositions = matchData.home_team.players
          .filter(player => player.is_holding)
          .slice(0, 6);
        
        const awayPositions = matchData.away_team.players
          .filter(player => player.is_holding)
          .slice(0, 6);
        
        setMatch({
          ...matchData,
          home_positions: homePositions,
          away_positions: awayPositions
        });
      }
    } catch (err) {
      setError('No se pudo cargar el partido');
      console.error('Error fetching match:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchControl = async (action) => {
    try {
      setIsLoadingAction(true);
      if (action === 'start') {
        await matchesService.startMatch(matchId);
      } else if (action === 'end') {
        await matchesService.endMatch(matchId);
      }
      await fetchMatchDetails();
    } catch (error) {
      console.error('Error en control de partido:', error);
      setError('Error al controlar el partido');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleSetControl = async (action) => {
    try {
      setIsLoadingAction(true);
      if (action === 'start') {
        await matchesService.startSet(matchId);
      } else if (action === 'end') {
        await matchesService.endSet(matchId);
      }
      await fetchMatchDetails();
    } catch (error) {
      console.error('Error en control de set:', error);
      setError('Error al controlar el set');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handlePlayerSwitch = (team, benchPlayerId, fieldPositionIndex) => {
    console.log(`Switch player in team ${team} at position ${fieldPositionIndex} with bench player ${benchPlayerId}`);
  };

  const handleAddPoint = (team, playerId, pointType) => {
    console.log(`Add point for player ${playerId} in team ${team} with point type ${pointType}`);
  };

  if (loading) return <div className="text-center text-2xl">Cargando...</div>;
  if (error) return <div className="text-center text-2xl text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <MatchControlHeader
            match={match}
            currentSet={match.current_set}
            homeSetsWon={match.home_sets_won}
            awaySetsWon={match.away_sets_won}
          />

          {/* Layout principal de 3 columnas (45% - 10% - 45%) */}
          <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr_4fr] gap-6">
            {/* Cancha Equipo Local */}
            <div className="md:col-span-1">
              <CourtControl
                team="home"
                teamName={match.home_team.name}
                score={match.home_score}
                positions={match.home_positions}
                players={match.home_team.players}
                isMatchStarted={match.status === 'in_progress'}
                currentSet={match.current_set}
                canStartNewSet={!match.current_set_started}
                isLoadingSetAction={isLoadingAction}
                onPlayerSwitch={handlePlayerSwitch}
                onPointScored={handleAddPoint}
              />
            </div>

            <div className="md:col-span-1 flex flex-col items-center space-y-4">
            {/* Control de Set */}
            <div className="w-full max-w-[170px] mt-20">
              <div className="text-xl font-bold text-center mb-2">
                Set {match.current_set}
              </div>
              <button
                onClick={() => handleSetControl(match.current_set_started ? 'end' : 'start')}
                disabled={isLoadingAction || match.status !== 'in_progress'}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 
                  ${match.current_set_started ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}
                  text-white transition-colors duration-200
                  ${match.status !== 'in_progress' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaForward className="mr-2" />
                {match.current_set_started ? 'Finalizar Set' : 'Iniciar Set'}
              </button>
            </div>

            {/* Control de Partido */}
            <div className="w-full max-w-[170px]">
              <button
                onClick={() => handleMatchControl(match.status === 'in_progress' ? 'end' : 'start')}
                disabled={isLoadingAction}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 
                  ${match.status === 'in_progress' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                  text-white transition-colors duration-200`}
              >
                {match.status === 'in_progress' ? (
                  <><FaStop className="mr-2" /> Finalizar Partido</>
                ) : (
                  <><FaPlay className="mr-2" /> Iniciar Partido</>
                )}
              </button>
            </div>
          </div>


            {/* Cancha Equipo Visitante */}
            <div className="md:col-span-1">
              <CourtControl
                team="away"
                teamName={match.away_team.name}
                score={match.away_score}
                positions={match.away_positions}
                players={match.away_team.players}
                isMatchStarted={match.status === 'in_progress'}
                currentSet={match.current_set}
                canStartNewSet={!match.current_set_started}
                isLoadingSetAction={isLoadingAction}
                onPlayerSwitch={handlePlayerSwitch}
                onPointScored={handleAddPoint}
              />
            </div>
          </div>




        </div>
      </div>
    </div>
  );
};

export default MatchControl;
