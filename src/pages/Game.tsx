import React from 'react';

import { useGame } from '../libs/connection/Game/Provider';

import Profile from '../components/game/inGame/Profile';
import GameHeader from '../components/game/inGame/GameHeader';
import GameState from '../components/game/inGame/GameState';

const Game: React.FC = () => {
  const { gameInfo, players } = useGame();

  return (
    <div className="flex flex-col w-full">
      <GameHeader />
      <GameState />
      <div className="flex flex-row flex-wrap">
        {players.map((player, i) => (
          <Profile key={i} player={player} isMine={players[0].id === player.id} />
        ))}
      </div>
    </div>
  );
};

export default Game;
