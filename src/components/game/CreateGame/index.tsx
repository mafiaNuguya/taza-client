import React, { useState } from "react";

import { useModal } from "../../Modal/Provider";
import DefaultButton from "../../buttons/Default";
import SettingTypeButton from "./SettingTypeButton";
import ArrowLeft from "../../svgs/ArrowLeft";
import ArrowRight from "../../svgs/ArrowRight";
import Close from "../../svgs/Close";

import type { SettingType } from "./SettingTypeButton";
import type Session from "../../../libs/webSocketSession/Session";

interface GameRoles {
  [key: string]: number;
}

interface CreateGameProps {
  session: Session;
}

const CreateGame: React.FC<CreateGameProps> = ({ session }) => {
  const modal = useModal();
  const [roomName, setRoomName] = useState<string>();
  const [isPrivate, setPrivate] = useState<boolean>(false);
  const [settingType, setSettingType] = useState<SettingType>("4set");
  const [roles, setRoles] = useState<GameRoles>({
    mafia: 1,
    police: 1,
    doctor: 1,
    civil: 1,
  });

  const handleChangeRoomName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRoomName(e.currentTarget.value);
  const handleChangeSettingType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "4set") {
      setRoles({
        mafia: 1,
        police: 1,
        doctor: 1,
        civil: 1,
      });
    }
    if (e.currentTarget.value === "6set") {
      setRoles({
        mafia: 2,
        police: 1,
        doctor: 1,
        civil: 2,
      });
    }
    setSettingType(e.currentTarget.value as SettingType);
  };
  const handleClickRoleCounter = (name: string, side: "right" | "left") => {
    setRoles({
      ...roles,
      [name]: side === "right" ? roles[name] + 1 : roles[name] - 1,
    });
  };
  const handleChangeCheckPrivate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivate(e.currentTarget.checked);
  };

  return (
    <div className="relative w-3/4 max-w-xl border border-white bg-zinc-800 rounded-md p-4 space-y-3">
      <div
        className="absolute -top-7 right-0 cursor-pointer"
        onClick={() => modal.close()}
      >
        <Close stroke="white" />
      </div>
      <div className="w-full text-centerbg-zinc-800 text-white text-center">
        😀 게임 옵션을 설정해 주세요 😀
      </div>
      <input
        className="D-input-default"
        type="text"
        value={roomName}
        placeholder="방제목"
        onChange={handleChangeRoomName}
      />
      <div className="text-white text-sm">
        비밀방
        <input
          type="checkbox"
          className="ml-2"
          checked={isPrivate}
          onChange={handleChangeCheckPrivate}
        />
      </div>
      <div className="w-full flex flex-wrap justify-between items-center space-y-3">
        <div className="text-white text-sm"> 인원: 4명 ~ 8명</div>
        <div className="flex flex-row flex-wrap">
          <SettingTypeButton
            value="4set"
            settingType={settingType}
            onChange={handleChangeSettingType}
          />
          <SettingTypeButton
            value="6set"
            settingType={settingType}
            onChange={handleChangeSettingType}
          />
          <SettingTypeButton
            value="custom"
            settingType={settingType}
            onChange={handleChangeSettingType}
            total={Object.values(roles).reduce((acc, curr) => acc + curr)}
          />
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap justify-between">
        {Object.keys(roles).map((key) => (
          <div className="flex flex-col justify-center items-center">
            <div className="text-white mb-2">{key}</div>
            <div className="flex flex-row items-center p-1 mb-4">
              <ArrowLeft
                stroke="white"
                className="m-2 cursor-pointer"
                onClick={() => handleClickRoleCounter(key, "left")}
                disabled={settingType !== "custom" || roles[key] === 1}
              />
              <div className="w-7 h-7 flex justify-center items-center rounded-full bg-primary-gray">
                {roles[key]}
              </div>
              <ArrowRight
                stroke="white"
                className="m-2 cursor-pointer"
                onClick={() => handleClickRoleCounter(key, "right")}
                disabled={
                  settingType !== "custom" ||
                  Object.values(roles).reduce((acc, curr) => acc + curr) >= 8
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center">
        <DefaultButton
          text="게임 생성하기"
          onClick={() => {}}
          disabled={!roomName}
        />
      </div>
    </div>
  );
};

export default CreateGame;
