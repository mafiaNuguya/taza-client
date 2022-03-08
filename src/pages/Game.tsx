import React, { useEffect } from "react";

import useGame from "../libs/hooks/useGame";
import useLeavePage from "../libs/hooks/useLeavePage";

import Profile from "../components/game/inGame/Profile";

const Game: React.FC = () => {
  const { players, leaveGame } = useGame();
  const leavEvent = useLeavePage();

  useEffect(() => {
    leavEvent.enable();

    return () => {
      leavEvent.disable();
      leaveGame();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="text-white" onClick={() => leaveGame()}>
        나가기
      </div>
      <div className="w-full h-52 bg-primary-gray"></div>
      <div className="flex flex-row flex-wrap">
        {players &&
          players.map((player, i) => <Profile key={i} player={player} />)}
      </div>
    </div>
  );
};

export default Game;
