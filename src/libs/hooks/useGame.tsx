import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useSession from "./useSession";
import Player from "../connection/Game/Player";
import Game from "../connection/Game";

const useGame = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { session, connect } = useSession();
  const [destroy, setDestroy] = useState<boolean>(false);
  const [game, setGame] = useState<Game>();
  const [players, setPlayers] = useState<Player[]>();
  const [gameInfo, setGameInfo] = useState<GameInfo>();

  const getAudioStream = async (): Promise<MediaStream> => {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    return audioStream;
  };
  const leaveGame = () => {
    session?.close();
    game?.close();
    navigate("/", { replace: true });
  };
  const handleUpdatePlayers = (players: Player[]) => setPlayers(players);
  const handleDestroyGame = (destroyed: boolean) => {
    if (!game?.gameInfo?.onGame) {
      setDestroy(destroyed);
    }
  };
  const handleUpdateGameInfo = (gameInfo: GameInfo) => setGameInfo(gameInfo);

  useEffect(() => {
    getAudioStream()
      .then((audioStream) => {
        const gameId = params.gameId!;
        connect(gameId, audioStream);
      })
      .catch(() => {
        alert("마이크 권한을 활성화 하고 다시 게임에 참여해 주세요");
        navigate("/", { replace: true });
      });
  }, []);

  useEffect(() => {
    if (session) {
      setGame(session.game);
    }
  }, [session]);

  useEffect(() => {
    if (destroy) {
      alert("방장이 나가 방이 파괴되었습니다.");
      leaveGame();
    }
  }, [destroy]);

  useEffect(() => {
    if (game) {
      setGameInfo(game.gameInfo);
    }
    game?.onPlayersUpdated(handleUpdatePlayers);
    game?.onGameDestroyed(handleDestroyGame);
    game?.onGameInfoUpdated(handleUpdateGameInfo);

    return () => {
      game?.removePlayersUpdated(handleUpdatePlayers);
      game?.removeGameDestroyed(handleDestroyGame);
      game?.removeGameInfoUpdated(handleUpdateGameInfo);
    };
  }, [game]);

  return { game, gameInfo, players, leaveGame };
};

export default useGame;
