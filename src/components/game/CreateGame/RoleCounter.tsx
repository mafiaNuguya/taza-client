import ArrowLeft from "../../svgs/ArrowLeft";
import ArrowRight from "../../svgs/ArrowRight";

export type Role = "mafia" | "police" | "doctor" | "civil";

export const roleNames = {
  mafia: "마피아",
  police: "경찰",
  doctor: "의사",
  civil: "시민",
};

interface RoleCounterProps {
  roleInfo: RoleInfo;
  gameType: GameType;
  updater: React.Dispatch<React.SetStateAction<RoleInfo>>;
}

const RoleCounter: React.FC<RoleCounterProps> = ({
  roleInfo,
  gameType,
  updater,
}) => {
  const handleClick = (name: Role, side: "left" | "right") => {
    updater({
      ...roleInfo,
      [name]: side === "right" ? roleInfo[name] + 1 : roleInfo[name] - 1,
    });
  };

  return (
    <div className="w-full flex flex-row flex-wrap justify-between">
      {Object.keys(roleInfo).map((role) => (
        <div key={role} className="flex flex-col justify-center items-center">
          <div className="text-white mb-2">{roleNames[role as Role]}</div>
          <div className="flex flex-row items-center p-1 mb-4">
            <ArrowLeft
              stroke="white"
              className="m-2 cursor-pointer"
              onClick={() => handleClick(role as Role, "left")}
              disabled={gameType !== "custom" || roleInfo[role as Role] === 1}
            />
            <div className="w-7 h-7 flex justify-center items-center rounded-full bg-white font-semibold">
              {roleInfo[role as Role]}
            </div>
            <ArrowRight
              stroke="white"
              className="m-2 cursor-pointer"
              onClick={() => handleClick(role as Role, "right")}
              disabled={
                gameType !== "custom" ||
                Object.values(roleInfo).reduce((acc, curr) => acc + curr) >= 8
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default RoleCounter;
