import React, { useEffect } from 'react';

import { useGame } from '../libs/connection/Game/Provider';
import useLeavePage from '../libs/hooks/useLeavePage';

import Profile from '../components/game/inGame/Profile';
import GameHeader from '../components/game/inGame/GameHeader';

const Game: React.FC = () => {
  const { gameInfo, players } = useGame();
  const leavEvent = useLeavePage();

  // const handleClickLeaveGame = () => {
  //   if (
  //     (game?.gameState !== "inGame" &&
  //       game?.myPlayer?.isMaster &&
  //       window.confirm("지금 나가면 방이 파괴됩니다.")) ||
  //     window.confirm("정말로 나가시겠습니까?")
  //   ) {
  //     // return leaveGame();
  //   }
  // };

  useEffect(() => {
    leavEvent.enable();

    return () => {
      leavEvent.disable();
    };
  }, []);

  // useEffect(() => {
  //   console.log(game);
  // }, [game]);

  return (
    <div className="w-full h-full">
      {/* <GameHeader gameInfo={game?.gameInfo} onClick={handleClickLeaveGame} /> */}
      {/* <GameState game={game} players={players} /> */}
      <div className="flex flex-row flex-wrap">
        {players.map((player, i) => (
          <Profile key={i} player={player} isMine={gameInfo?.masterId === player.id} />
        ))}
      </div>
    </div>
  );
};

export default Game;
