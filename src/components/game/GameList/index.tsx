import { useNavigate } from "react-router-dom";

import type { Role } from "../CreateGame/RoleCounter";

import UserProfile from "../../user/UserProfile";
import RoleTag from "./RoleTag";

interface RoomProps {
  gameInfo: GameInfo;
}

const GameList: React.FC<RoomProps> = ({ gameInfo }) => {
  const { gameId, roomName, sessions, roleInfo } = gameInfo;
  const headCount = 4;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/game/${gameId}`, { replace: true })}
      className="flex flex-row border-2 text-primary-gray border-primary-gray rounded-2xl mb-10 p-5 text-sm hover:opacity-70 cursor-pointer"
    >
      <div className="flex flex-col flex-1 justify-between">
        <div className="text-2xl">{roomName}</div>
        <div className="w-full flex flex-row flex-wrap flex-1 p-1">
          {new Array(headCount).fill("").map((_, i) => {
            if (sessions[i]) {
              return <UserProfile key={i} name={sessions[i].name} />;
            }
            return (
              <div
                key={i}
                className="w-10 h-10 rounded-full border border-white mr-2 my-2 p-1"
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col ml-3">
        <div className="border-b mb-5">{`시작인원 ${headCount}`}</div>
        {Object.entries(roleInfo).map((role) => (
          <RoleTag key={role[0]} name={role[0] as Role} count={1} />
        ))}
      </div>
    </div>
  );
};

export default GameList;
