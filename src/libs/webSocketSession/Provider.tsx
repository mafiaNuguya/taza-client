import { createContext, useContext, useRef, useState } from "react";

import Session from "./Session";

interface WebSocketSession {
  session: any;
  connect: () => void;
}

const WebSocketSessionContext = createContext<WebSocketSession>({
  session: null,
  connect: () => {},
});

const useProvideWebSocketSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const updateSession = (data: any) =>
    setSession({
      ...session,
      ...data,
    });

  const connect = () => {
    if (!ws.current) {
      ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      ws.current.addEventListener("open", () => {});
      ws.current.addEventListener("close", () => {
        session?.disconnectSocket();
      });
      ws.current.addEventListener("error", () => {});
      ws.current.addEventListener("message", (e) => {});

      if (!session) {
        const session = new Session(ws.current, updateSession);
        setSession(session);
      } else {
        session.connectSocket(ws.current);
      }
    }
  };

  return {
    session,
    connect,
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
