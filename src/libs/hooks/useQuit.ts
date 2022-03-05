import { useNavigate } from "react-router-dom";

export const handleLeaveEvent = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = "";
};

const useQuit = () => {
  const navigate = useNavigate();

  const handleBackEvent = () => {
    const isWaitingRoom = window.location.pathname === "/waiting";

    if (
      window.confirm(
        `${
          isWaitingRoom
            ? "대기실에서 퇴장합니다"
            : "게임을 중단하고 방에서 나가시겠습니까?"
        }`
      )
    ) {
      return navigate(`${isWaitingRoom ? "/" : "/waiting"}`, { replace: true });
    }

    return window.history.pushState({ id: 1 }, "", "?moved");
  };

  const leaveEvent = {
    enable: () => window.addEventListener("beforeunload", handleLeaveEvent),
    disable: () => window.removeEventListener("beforeunload", handleLeaveEvent),
  };
  const backEvent = {
    enable: () => window.addEventListener("popstate", handleBackEvent),
    disable: () => window.removeEventListener("popstate", handleBackEvent),
  };

  return {
    quitEventEnable: () => {
      backEvent.enable();
      leaveEvent.enable();
    },
    quitEventDisable: () => {
      backEvent.disable();
      leaveEvent.disable();
    },
  };
};

export default useQuit;
