import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useModal } from "../Modal/Provider";
import Session from "../connection/Session";

import Disconnected from "../../components/errors/Disconnected";

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  const connect = (gameId: string, stream: MediaStream) => {
    ws.current = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL}/${gameId}`
    );
    const session = new Session(ws.current, stream);
    setSession(session);

    ws.current.addEventListener("open", () => {});
    ws.current.addEventListener("close", (e) => {
      if (e.code === 1000) {
        alert(e.reason);
        navigate("/", { replace: true });
      }
    });
    ws.current.addEventListener("error", (e) => {
      navigate("/");
    });
    ws.current.addEventListener("message", (e) => {
      try {
        const action = JSON.parse(e.data.toString());
        session.handleMessage(action);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return { session, connect };
};

export default useSession;
