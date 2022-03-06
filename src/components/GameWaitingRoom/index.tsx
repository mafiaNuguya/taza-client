import type { GameRoom } from "../../libs/hooks/useGameRooms";
import type { Role } from "../game/CreateGame/RoleCounter";

import UserProfile from "../user/UserProfile";
import RoleTag from "./RoleTag";

interface RoomProps {
  room: GameRoom;
}

const GameWaitingRoom: React.FC<RoomProps> = ({ room }) => {
  const { roomName, sessions, roleCounts } = room;
  const headCount = Object.values(roleCounts).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const allSeats = new Array(headCount).fill("");

  return (
    <div className="flex flex-row border-2 text-primary-gray border-primary-gray rounded-2xl mb-10 p-5 text-sm hover:opacity-70 cursor-pointer">
      <div className="flex flex-col flex-1 justify-between">
        <div className="text-2xl">{roomName}</div>
        <div className="w-full flex flex-row flex-wrap flex-1 p-1">
          {allSeats.map((_, i) => {
            if (sessions[i]) {
              return (
                <UserProfile key={sessions[i].id} name={sessions[i].name} />
              );
            }
            return (
              <div className="w-10 h-10 rounded-full border border-white mr-2 my-2 p-1" />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col ml-3">
        <div className="border-b mb-5">{`시작인원 ${headCount}`}</div>
        {Object.entries(roleCounts).map((role) => (
          <RoleTag key={role[0]} name={role[0] as Role} count={role[1]} />
        ))}
      </div>
    </div>
  );
};

export default GameWaitingRoom;
