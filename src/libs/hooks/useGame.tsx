import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useSession from "./useSession";
import Player from "../connection/Game/Player";
import Game from "../connection/Game";

const useGame = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { session, connect } = useSession();
  const [game, setGame] = useState<Game>();
  const [destroy, setDestroy] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>();

  const getAudioStream = async (): Promise<MediaStream> => {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    return audioStream;
  };

  const leaveGame = () => {
    session?.socket.close();
    game?.close();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (destroy) leaveGame();
  }, [destroy]);

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
      const { game } = session;
      setGame(game);
    }
  }, [session]);

  useEffect(() => {
    const updatePlayers = (players: Player[]) => setPlayers(players);
    const destroyGame = (destroy: boolean) => setDestroy(destroy);

    if (game) {
      game.listen.on.playersUpdated(updatePlayers);
      game.listen.on.destroyGame(destroyGame);
    }

    return () => {
      game?.listen.off.playersUpdated(updatePlayers);
      game?.listen.off.destroyGame(destroyGame);
    };
  }, [game]);

  return { players, leaveGame };
};

export default useGame;
