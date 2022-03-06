import type { GameType } from "./GameTypeSelect";

import ArrowLeft from "../../svgs/ArrowLeft";
import ArrowRight from "../../svgs/ArrowRight";

export type Role = "mafia" | "police" | "doctor" | "civil";

export type RoleCounts = {
  [key in Role]: number;
};

export const roleNames = {
  mafia: "마피아",
  police: "경찰",
  doctor: "의사",
  civil: "시민",
};

interface RoleCounterProps {
  roleCounts: RoleCounts;
  gameType: GameType;
  updater: React.Dispatch<React.SetStateAction<RoleCounts>>;
}

const RoleCounter: React.FC<RoleCounterProps> = ({
  roleCounts,
  gameType,
  updater,
}) => {
  const handleClick = (name: Role, side: "left" | "right") => {
    updater({
      ...roleCounts,
      [name]: side === "right" ? roleCounts[name] + 1 : roleCounts[name] - 1,
    });
  };

  return (
    <div className="w-full flex flex-row flex-wrap justify-between">
      {Object.keys(roleCounts).map((role) => (
        <div className="flex flex-col justify-center items-center">
          <div className="text-white mb-2">{roleNames[role as Role]}</div>
          <div className="flex flex-row items-center p-1 mb-4">
            <ArrowLeft
              stroke="white"
              className="m-2 cursor-pointer"
              onClick={() => handleClick(role as Role, "left")}
              disabled={gameType !== "custom" || roleCounts[role as Role] === 1}
            />
            <div className="w-7 h-7 flex justify-center items-center rounded-full bg-white font-semibold">
              {roleCounts[role as Role]}
            </div>
            <ArrowRight
              stroke="white"
              className="m-2 cursor-pointer"
              onClick={() => handleClick(role as Role, "right")}
              disabled={
                gameType !== "custom" ||
                Object.values(roleCounts).reduce((acc, curr) => acc + curr) >= 8
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default RoleCounter;
