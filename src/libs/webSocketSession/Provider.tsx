import { createContext, useContext, useRef, useState } from "react";
import { useModal } from "../../components/Modal/Provider";

import Session from "./Session";
import Disconnected from "../../components/errors/Disconnected";

interface WebSocketSession {
  session: Session | null;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketSessionContext = createContext<WebSocketSession>({
  session: null,
  connect: () => {},
  disconnect: () => {},
});

const useProvideWebSocketSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const modal = useModal();

  const updateSession = (data: any) =>
    setSession({
      ...session,
      ...data,
    });

  const connect = () => {
    if (!ws.current && !session) {
      ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      const session = new Session(ws.current, updateSession);
      setSession(session);

      ws.current.addEventListener("open", () => {});
      ws.current.addEventListener("close", () => {
        console.log("socket close!!!");
        modal.open(<Disconnected />);
      });
      ws.current.addEventListener("error", () => {
        console.log("socket error");
      });
      ws.current.addEventListener("message", (e) => {
        try {
          const action = JSON.parse(e.data.toString());
          session?.handleMessage(action);
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  const disconnect = () => {
    if (!ws.current) return;
    ws.current.close();
  };

  return {
    session,
    connect,
    disconnect,
  };
};

const WebSocketSessionProvider: React.FC = ({ children }) => {
  const value = useProvideWebSocketSession();

  return (
    <WebSocketSessionContext.Provider value={value}>
      {children}
    </WebSocketSessionContext.Provider>
  );
};

export const useSession = () => useContext(WebSocketSessionContext);

export default WebSocketSessionProvider;
