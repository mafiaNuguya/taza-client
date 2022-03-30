import { useEffect, useState } from 'react';
import Session from '../connection/Session';
import Game from '../connection/Game';
import { useNavigate } from 'react-router-dom';

const useGameEnter = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>();
  const [game, setGame] = useState<Game>();

  const handleUpdateGame = (game: Game) => setGame(game);

  const enter = (audioStream: MediaStream, gameId: string, userId: string, userName: string) => {
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/${gameId}`);
    const session = new Session(ws, audioStream, gameId, userId, userName);
    setSession(session);

    ws.addEventListener('open', e => {});
    ws.addEventListener('close', e => {
      console.log('겟게임', game);
      navigate('/');
    });
    ws.addEventListener('error', e => {
      navigate('/');
    });
    ws.addEventListener('message', e => {
      try {
        const action = JSON.parse(e.data.toString());
        session.handleMessage(action);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    session?.onGameUpdated(handleUpdateGame);
    return () => session?.removeGameUpdated(handleUpdateGame);
  }, [session]);

  return { game, enter };
};

export default useGameEnter;
