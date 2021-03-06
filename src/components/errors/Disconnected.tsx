// import { handleLeaveEvent } from "../../libs/hooks/useLeavePage";

import DefaultButton from '../buttons/Default';

const Disconnected: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-white">π₯²</div>
      <div className="text-white">μλ²μμ μ°κ²°μ΄ λμ΄μ‘μ΅λλ€γ </div>
      <div className="flex flex-row mt-6 space-x-5">
        {/* <a
          href="/"
          className="flex justify-center items-center min-w-[100px] h-9 px-3 rounded-lg bg-primary-gray text-sm hover:opacity-70"
          onClick={() => {
            window.removeEventListener('beforeunload', handleLeaveEvent);
          }}
        >
          λ€μ μ μνκΈ°
        </a> */}
        <DefaultButton text="λ‘κ·ΈμμνκΈ°" onClick={() => {}} />
      </div>
    </div>
  );
};

export default Disconnected;
