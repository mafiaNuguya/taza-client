import React, { useState } from "react";

import CloseButton from "./CloseButton";
import Title from "./Title";
import RoomNameInput from "./RoomNameInput";
import PrivateCheckBox from "./PrivateCheckBox";
import GameTypeSelect from "./GameTypeSelect";
import RoleCounter from "./RoleCounter";
import DefaultButton from "../../buttons/Default";

interface CreateGameProps {
  createGame: (data: any, withCookie: boolean) => any;
  loading: boolean;
}

const CreateGame: React.FC<CreateGameProps> = ({ createGame, loading }) => {
  const [roomName, setRoomName] = useState<string>("마피아 할사람~!!");
  const [isPrivate, setPrivate] = useState<boolean>(false);
  const [gameType, setGameType] = useState<GameType>("4set");
  const [roleInfo, setRoleInfo] = useState<RoleInfo>({
    mafia: 1,
    police: 1,
    doctor: 1,
    civil: 1,
  });

  const handleCreateGame = () => {
    const createGameData: CreateGameData = {
      roomName,
      isPrivate,
      gameType,
      roleInfo,
      userCount: Object.values(roleInfo).reduce((acc, curr) => acc + curr),
    };
    createGame({ createGameData }, true);
  };

  return (
    <div className="relative w-3/4 max-w-xl border border-white bg-zinc-800 rounded-md p-4 space-y-3">
      {loading && (
        <div className="absolute w-full h-full bg-opacity-70 bg-black">
          로딩중
        </div>
      )}
      <CloseButton />
      <Title />
      <RoomNameInput value={roomName} updater={setRoomName} />
      <PrivateCheckBox value={isPrivate} updater={setPrivate} />
      <GameTypeSelect
        selected={gameType}
        roleInfo={roleInfo}
        gameTypeUpdater={setGameType}
        roleCountUpdater={setRoleInfo}
      />
      <RoleCounter
        roleInfo={roleInfo}
        gameType={gameType}
        updater={setRoleInfo}
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
