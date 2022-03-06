import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "../libs/hooks/useUser";
import useGameRooms from "../libs/hooks/useGameRooms";

import GameWaitingRoom from "../components/GameWaitingRoom";
import Button from "../components/buttons/Default";
import { useModal } from "../components/Modal/Provider";
import CreateGame from "../components/game/CreateGame";

const Waiting: React.FC = () => {
  const user = useUser();
  const [gameRooms] = useGameRooms();
  const modal = useModal();
  const navigate = useNavigate();

  const openGameSetPopup = () => {
    if (user) {
      modal.open(<CreateGame />);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between w-full h-20 px-5">
        <div className="flex flex-col text-sm h-11 text-primary-gray">
          <div className="mr-4">{`대기중인 게임: ${gameRooms?.length}`}</div>
        </div>
        <div className="flex flex-row">
          <Button className={"mr-3"} text={"코드로 참여"} onClick={() => {}} />
          <Button text={"방만들기"} onClick={openGameSetPopup} />
        </div>
      </div>
      <div className="flex-1 overflow-scroll box-border">
        <div className="px-5 py-3">
          {gameRooms &&
            gameRooms.map((room, i) => <GameWaitingRoom key={i} room={room} />)}
        </div>
      </div>
    </div>
  );
};

export default Waiting;
