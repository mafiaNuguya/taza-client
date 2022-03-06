import React, { useState } from "react";

import type { GameType } from "./GameTypeSelect";
import type { RoleCounts } from "./RoleCounter";

import DefaultButton from "../../buttons/Default";
import CloseButton from "./CloseButton";
import Title from "./Title";
import RoomNameInput from "./RoomNameInput";
import PrivateCheckBox from "./PrivateCheckBox";
import GameTypeSelect from "./GameTypeSelect";
import RoleCounter from "./RoleCounter";

export type CreateGameData = {
  roomName: string;
  isPrivate: boolean;
  gameType: GameType;
  roleCounts: RoleCounts;
};

interface CreateGameProps {}

const CreateGame: React.FC<CreateGameProps> = ({}) => {
  const [roomName, setRoomName] = useState<string>("마피아 할사람~!!");
  const [isPrivate, setPrivate] = useState<boolean>(false);
  const [gameType, setGameType] = useState<GameType>("4set");
  const [roleCounts, setRoleCounts] = useState<RoleCounts>({
    mafia: 1,
    police: 1,
    doctor: 1,
    civil: 1,
  });

  const handleCreateGame = () => {};

  return (
    <div className="relative w-3/4 max-w-xl border border-white bg-zinc-800 rounded-md p-4 space-y-3">
      <CloseButton />
      <Title />
      <RoomNameInput value={roomName} updater={setRoomName} />
      <PrivateCheckBox value={isPrivate} updater={setPrivate} />
      <GameTypeSelect
        selected={gameType}
        roleCounts={roleCounts}
        gameTypeUpdater={setGameType}
        roleCountUpdater={setRoleCounts}
      />
      <RoleCounter
        roleCounts={roleCounts}
        gameType={gameType}
        updater={setRoleCounts}
      />
      <div className="w-full flex justify-center py-3">
        <DefaultButton
          text="게임 생성하기"
          onClick={handleCreateGame}
          disabled={!roomName}
        />
      </div>
    </div>
  );
};

export default CreateGame;
