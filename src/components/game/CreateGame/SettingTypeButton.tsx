export type SettingType = "4set" | "6set" | "custom";

interface SettingTypeButton {
  value: SettingType;
  settingType: SettingType;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  total?: number;
}

const SettingTypeButton: React.FC<SettingTypeButton> = ({
  value,
  settingType,
  onChange,
  total,
}) => {
  return (
    <label className="flex flex-row m-2">
      <input
        id={value}
        type="radio"
        className="hidden peer"
        value={value}
        checked={settingType === value}
        onChange={onChange}
      />
      <div className="peer-checked:text-primary-gray peer-checked:border-primary-gray cursor-pointer py-2 px-3 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700">
        {value}
        {settingType === "custom" && " "}
        {settingType === "custom" && total}
      </div>
    </label>
  );
};

export default SettingTypeButton;
