interface SelectButtonProps {
  value: GameType;
  selected: GameType;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  userCount?: number;
}

const SelectButton: React.FC<SelectButtonProps> = ({
  value,
  selected,
  onChange,
  userCount,
}) => {
  return (
    <div className="m-1">
      <label className="flex flex-row">
        <input
          id={value}
          type="radio"
          className="hidden peer"
          value={value}
          checked={selected === value}
          onChange={onChange}
        />
        <div className="peer-checked:text-primary-gray peer-checked:border-primary-gray cursor-pointer py-2 px-3 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700">
          {value}
          {selected === "custom" && " "}
          {selected === "custom" && userCount}
        </div>
      </label>
    </div>
  );
};

export default SelectButton;
