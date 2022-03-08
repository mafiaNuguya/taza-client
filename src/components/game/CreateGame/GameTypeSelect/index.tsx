import SelectButton from "./SelectButton";

const typeObjArray = [
  {
    name: "4인",
    type: "4set",
  },
  {
    name: "6인",
    type: "6set",
  },
  {
    name: "커스텀",
    type: "custom",
  },
];

interface GameTypeSelectProps {
  selected: GameType;
  roleInfo: RoleInfo;
  gameTypeUpdater: React.Dispatch<GameType>;
  roleCountUpdater: React.Dispatch<any>;
}

const GameTypeSelect: React.FC<GameTypeSelectProps> = ({
  selected,
  roleInfo,
  gameTypeUpdater,
  roleCountUpdater,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    gameTypeUpdater(value as GameType);
    roleCountUpdater({
      mafia: value === "4set" ? 1 : 2,
      police: 1,
      doctor: 1,
      civil: value === "4set" ? 1 : 2,
    });
  };

  return (
    <div className="w-full flex flex-wrap justify-between items-center space-y-3 pb-4">
      <div className="text-white text-sm"> 인원: 4명 ~ 8명</div>
      <div className="flex flex-row flex-wrap">
        {typeObjArray.map((obj) => (
          <SelectButton
            key={obj.name}
            value={obj.type as GameType}
            selected={selected}
            onChange={handleChange}
            userCount={
              obj.type === "custom"
                ? Object.values(roleInfo).reduce((acc, curr) => acc + curr)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default GameTypeSelect;
