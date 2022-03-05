import { useCallback, useEffect } from "react";

import { useSession } from "../libs/webSocketSession/Provider";
import { useModal } from "../components/Modal/Provider";
import useQuit from "../libs/hooks/useQuit";

import Room from "../components/Room";
import Button from "../components/buttons/Default";
import CreateGame from "../components/game/CreateGame/index";

const Waiting: React.FC = () => {
  const { session, connect, disconnect } = useSession();
  const { quitEventEnable, quitEventDisable } = useQuit();
  const modal = useModal();

  const setGameOption = useCallback(() => {
    if (session) {
      modal.open(<CreateGame session={session} />);
    }
  }, [session]);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (session) {
      window.history.pushState("", "", "?moved");

      if (window.location.search === "?moved") {
        quitEventEnable();
      }

      return () => quitEventDisable();
    }

    return () => {
      if (window.location.search === "?moved") {
        disconnect();
      }
    };
  }, [session]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between w-full h-20 px-5">
        <div className="flex flex-col text-sm h-11 text-primary-gray">
          <div>대기자 수 {session?.waitingChannel?.totalUser}</div>
          <div>대기 중인 게임 12</div>
        </div>
        <div className="flex flex-row">
          <Button
            className={"mr-3"}
            text={"코드로 참여하기"}
            onClick={() => {}}
          />
          <Button text={"방만들기"} onClick={setGameOption} />
        </div>
      </div>
      <div className="flex-1 overflow-scroll box-border">
        <div className="px-5 py-3">
          {[1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
            <Room key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Waiting;
