import { cls } from "../../libs/utils";

interface ButtonProps {
  text: string;
  onClick: (...any: any) => any;
  className?: string;
}

const Default: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={() => onClick()}
      className={cls(
        "min-w-[100px] h-9 px-3 rounded-lg bg-primary-gray text-sm hover:opacity-70",
        className || ""
      )}
    >
      {text}
    </button>
  );
};

export default Default;
