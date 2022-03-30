import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useUser from '../../hooks/useUser';
import useGameEnter from '../../hooks/useGameEnter';
import useGameElement from '../../hooks/useGameElement';
import Player from './Player';

export const gameInfoDefault: GameInfo = {
  gameId: '',
  roomName: '',
  isPrivate: false,
  userCount: 0,
  gameType: '4set',
  roleInfo: {
    mafia: 0,
    civil: 0,
    doctor: 0,
    police: 0,
  },
  masterId: '',
  sessions: [],
};

type Games = {
  gameState: GameState;
  gameInfo: GameInfo;
  gamePhase: GamePhase;
  players: Player[];
  leaveGame: () => any;
  // startGame: () => any;
};

const contextDefault: Games = {
  gameState: 'waiting',
  gameInfo: gameInfoDefault,
  gamePhase: 'init',
  players: [],
  leaveGame: () => {},
  // startGame: () => {},
};
const GameContext = createContext<Games>(contextDefault);

const getAudioStream = async (): Promise<MediaStream> =>
  navigator.mediaDevices.getUserMedia({ audio: true });

const useProvideGame = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user] = useUser();
  const micPermission = useRef(false);
  const { game, enter } = useGameEnter();
  const { gameState, gameInfo, gamePhase, players } = useGameElement(game);

  const handleBack = () => {
    if (window.confirm('뒤로가겠습니까?')) return leaveGame();
    window.history.pushState('', '', '?moved');
  };
  const handleRefresh = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
  };
  const leaveGame = () => {
    game?.leaveGame();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (user && !micPermission.current) {
      getAudioStream()
        .then(audioStream => {
          micPermission.current = true;
          const gameId = params.gameId!;
          enter(audioStream, gameId, user.id, user.name);
        })
        .catch(() => {
          micPermission.current = false;
          alert('마이크 권한을 활성화 하고 다시 게임에 참여해 주세요');
          navigate('/', { replace: true });
        });
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleRefresh);
    window.addEventListener('popstate', handleBack);

    if (window.location.search !== '?moved') {
      window.history.pushState(null, '', '?moved');
    }

    return () => {
      window.removeEventListener('beforeunload', handleRefresh);
      window.removeEventListener('popstate', handleBack);
    };
  }, []);

  return {
    gameState,
    gameInfo,
    gamePhase,
    players,
    leaveGame,
    // startGame,
  };
};

const GameProvider: React.FC = ({ children }) => {
  const game = useProvideGame();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext<Games>(GameContext);

export default GameProvider;
