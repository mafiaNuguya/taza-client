import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Game from '.';
import useSession from '../../hooks/useSession';
import Player from './Player';

type Games = {
  gameState: GameState;
  gameInfo: GameInfo | null;
  gamePhase: GamePhase;
  players: Player[];
  // direct: () => any;
  // broadcast: () => any;
  // leaveGame: () => any;
};

const contextDefault: Games = {
  gameState: 'waiting',
  gameInfo: null,
  gamePhase: 'init',
  players: [],
  // direct: () => {},
  // broadcast: () => {},
  // leaveGame: () => {},
};
const GameContext = createContext<Games>(contextDefault);

const getAudioStream = async (): Promise<MediaStream> =>
  navigator.mediaDevices.getUserMedia({ audio: true });

const useProvideGame = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { session, connect } = useSession();
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('init');
  const [players, setPlayers] = useState<Player[]>([]);

  const handleUpdateGame = (game: Game) => {
    setGame(game);
    setPlayers([game.myPlayer]);
  };
  const handleUpdateGameState = (gameState: GameState) => setGameState(gameState);
  const handleUpdateGameInfo = (gameInfo: GameInfo) => setGameInfo(gameInfo);
  const handleUpdateGamePhase = (gamePhase: GamePhase) => setGamePhase(gamePhase);
  const handleUpdatePlayers = (players: Player[]) => setPlayers(players);

  useEffect(() => {
    getAudioStream()
      .then(audioStream => {
        const gameId = params.gameId!;
        connect(gameId, audioStream);
      })
      .catch(() => {
        alert('마이크 권한을 활성화 하고 다시 게임에 참여해 주세요');
        navigate('/', { replace: true });
      });
  }, []);

  useEffect(() => {
    session?.onGameUpdated(handleUpdateGame);
    return () => session?.removeGameUpdated(handleUpdateGame);
  }, [session]);

  useEffect(() => {
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

  return {
    gameState,
    gameInfo,
    gamePhase,
    players,
    // direct,
    // broadcast,
    // leaveGame,
  };
};

const GameProvider: React.FC = ({ children }) => {
  const game = useProvideGame();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext<Games>(GameContext);

export default GameProvider;
