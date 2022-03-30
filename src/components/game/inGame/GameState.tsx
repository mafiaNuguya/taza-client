import { useEffect, useState } from 'react';

import { useGame } from '../../../libs/connection/Game/Provider';

import Default from '../../buttons/Default';

const GameState: React.FC = () => {
  const { gameState, gameInfo, players } = useGame();
  const [canStart, setCanStart] = useState(gameInfo.userCount === players.length);

  const handleClickStartGame = () => {
    if (!canStart) return;
    // startGame();
  };

  useEffect(() => {
    setCanStart(gameInfo.userCount === players.length);
  }, [gameInfo, players]);

  return (
    <div className="flex justify-center items-center w-full h-52 bg-zinc-700 mb-1">
      {gameState === 'inGame' && <div></div>}
      {gameState === 'waiting' &&
        (players[0]?.isMaster ? (
          <Default
            text={
              canStart
                ? '게임 시작하기'
                : `인원이 부족합니다. (${players.length} / ${gameInfo.userCount})`
            }
            onClick={handleClickStartGame}
            disabled={!canStart}
          />
        ) : (
          <div
            className={`flex justify-center items-center min-w-[100px] h-9 px-3 rounded-lg bg-primary-gray text-sm ${
              canStart ? 'opacity-60' : 'opacity-20'
            }`}
          >
            {canStart
              ? '게임을 준비해 주세요!'
              : `인원이 부족합니다. (${players.length} / ${gameInfo.userCount})`}
          </div>
        ))}
    </div>
  );
};

export default GameState;
