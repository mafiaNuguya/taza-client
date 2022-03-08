import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "../libs/hooks/useUser";
import useGameList from "../libs/hooks/useGameList";
import useMutation from "../libs/hooks/useMutation";
import { useModal } from "../libs/Modal/Provider";

import GameList from "../components/game/GameList";
import Button from "../components/buttons/Default";
import CreateGame from "../components/game/CreateGame";

interface MutationResult {
  ok: boolean;
  gameId: string;
}

const Waiting: React.FC = () => {
  const [user] = useUser();
  const [gameList] = useGameList();
  const modal = useModal();
  const navigate = useNavigate();
  const [createGame, { loading, data: createGameData }] =
    useMutation<MutationResult>(`${process.env.REACT_APP_API_URL}/game/create`);

  const openCreateGamePopup = () => {
    if (user) {
      modal.open(<CreateGame createGame={createGame} loading={loading} />);
    }
  };

  useEffect(() => {
    if (user?.ingame) {
      navigate(`/game/${user?.ingame}`);
    }
  }, [user?.ingame]);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    if (createGameData && createGameData.ok) {
      modal.close();
      navigate(`/game/${createGameData.gameId}`, { replace: true });
    }
  }, [createGameData]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between w-full h-20 px-5">
        <div className="flex flex-col text-sm h-11 text-primary-gray">
          <div className="mr-4">{`대기중인 게임: ${gameList?.length}`}</div>
        </div>
        <div className="flex flex-row">
          <Button className={"mr-3"} text={"코드로 참여"} onClick={() => {}} />
          <Button text={"방만들기"} onClick={openCreateGamePopup} />
        </div>
      </div>
      <div className="flex-1 overflow-scroll box-border">
        <div className="px-5 py-3">
          {gameList &&
            gameList.map((game, i) => <GameList key={i} gameInfo={game} />)}
        </div>
      </div>
    </div>
  );
};

export default Waiting;
