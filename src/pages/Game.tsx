import React, { useEffect } from "react";

import useGame from "../libs/hooks/useGame";
import useLeavePage from "../libs/hooks/useLeavePage";

import Profile from "../components/game/inGame/Profile";
import GameHeader from "../components/game/inGame/GameHeader";
import GameState from "../components/game/inGame/GameState";

const Game: React.FC = () => {
  const { game, gameInfo, players, leaveGame } = useGame();
  const leavEvent = useLeavePage();

  const handleClickLeaveGame = () => {
    if (
      (!gameInfo?.onGame &&
        game?.myPlayer?.isMaster &&
        window.confirm("지금 나가면 방이 파괴됩니다.")) ||
      window.confirm("정말로 나가시겠습니까?")
    ) {
      return leaveGame();
    }
  };

  useEffect(() => {
    leavEvent.enable();

    return () => {
      leavEvent.disable();
      leaveGame();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <GameHeader gameInfo={gameInfo} onClick={handleClickLeaveGame} />
      <GameState game={game} players={players} />
      <div className="flex flex-row flex-wrap">
        {players &&
          players.map((player, i) => (
            <Profile
              key={i}
              player={player}
              isMine={game?.myPlayer?.id === player.id}
            />
          ))}
      </div>
    </div>
  );
};

export default Game;
