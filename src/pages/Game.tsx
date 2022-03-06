import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateGame from "../components/game/CreateGame";
import { useModal } from "../components/Modal/Provider";

import { useSession } from "../libs/webSocketSession/Provider";

const Game: React.FC = () => {
  const { session, connect, disconnect } = useSession();
  const params = useParams();
  const modal = useModal();

  const openCreateGamePopup = useCallback(() => {
    if (session) {
      modal.open(<CreateGame />);
    }
  }, [session]);

  useEffect(() => {
    connect();
  }, []);

  return <h1>gameId {params.gameId}</h1>;
};

export default Game;
