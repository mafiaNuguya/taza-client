import { useEffect, useState } from "react";
import Game from "../../../libs/connection/Game";
import Player from "../../../libs/connection/Game/Player";

import Default from "../../buttons/Default";

interface GameStateProps {
  game?: Game;
  players?: Player[];
}

const GameState: React.FC<GameStateProps> = ({ game, players }) => {
  const [canStart, setCanStart] = useState(
    game?.gameInfo?.userCount === players?.length
  );

  const handleClickStartGame = () => {
    if (!canStart) return;
    game?.startGame();
  };

  useEffect(() => {
    setCanStart(game?.gameInfo?.userCount === players?.length);
  }, [game, players]);

  return (
    <div className="flex justify-center items-center w-full h-52 bg-zinc-700">
      {game?.gameInfo?.onGame ? (
        <div>게임 시작했어요</div>
      ) : (
        <div>
          {game?.myPlayer?.isMaster ? (
            <Default
              text={
                canStart
                  ? "게임 시작하기"
                  : `인원이 부족합니다. (${players?.length} / ${game.gameInfo?.userCount})`
              }
              onClick={handleClickStartGame}
              disabled={!canStart}
            />
          ) : (
            <div>게임 시작 전입니다.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameState;
