import { useEffect, useState } from 'react';
import Game from '../connection/Game';
import Player from '../connection/Game/Player';
import { gameInfoDefault } from '../connection/Game/Provider';

const useGameElement = (game?: Game) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [gameInfo, setGameInfo] = useState<GameInfo>(gameInfoDefault);
  const [gamePhase, setGamePhase] = useState<GamePhase>('init');
  const [players, setPlayers] = useState<Player[]>([]);

  const handleUpdateGameState = (gameState: GameState) => setGameState(gameState);
  const handleUpdateGameInfo = (gameInfo: GameInfo) => setGameInfo(gameInfo);
  const handleUpdateGamePhase = (gamePhase: GamePhase) => setGamePhase(gamePhase);
  const handleUpdatePlayers = (players: Player[]) => setPlayers(players);

  useEffect(() => {
    if (game) {
      setGameState(game.gameState);
      setPlayers([game.myPlayer]);
      setGameInfo(game.gameInfo);
      setGamePhase(game.gamePhase);
    }

    game?.addEventListener('gameInfo', handleUpdateGameInfo);
    game?.addEventListener('gameState', handleUpdateGameState);
    game?.addEventListener('gamePhase', handleUpdateGamePhase);
    game?.addEventListener('players', handleUpdatePlayers);

    return () => {
      game?.removeEventListenr('gameInfo', handleUpdateGameInfo);
      game?.removeEventListenr('gameState', handleUpdateGameState);
      game?.removeEventListenr('gamePhase', handleUpdateGamePhase);
      game?.removeEventListenr('players', handleUpdatePlayers);
    };
  }, [game]);

  return { gameState, gameInfo, gamePhase, players };
};

export default useGameElement;
