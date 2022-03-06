import type { CreateGameData } from "../../components/game/CreateGame";
import type { NavigateFunction } from "react-router-dom";

import { ReceiveAction } from "./actions/receive";
import actionCreator, { SendAction } from "./actions/send";

type ChannelType = "waiting" | "game";

type WaitingChannel = {
  totalUser: number;
};

class Session {
  id?: string;
  name?: string;
  myPeer?: RTCPeerConnection;
  currentChannel?: ChannelType;
  gameChannel: any;
  waitingChannel?: WaitingChannel;

  constructor(
    private socket: WebSocket | null,
    public navigator: NavigateFunction
  ) {}

  private emit(action: SendAction) {
    this.socket?.send(JSON.stringify(action));
  }

  getSocket() {
    return this.socket;
  }

  addSocket(socket: WebSocket) {
    if (!this.socket) this.socket = socket;
  }

  deleteSocket() {
    if (this.socket) this.socket = null;
  }

  createGame(data: CreateGameData) {
    console.log(`게임을 생성합니다.${data}`);
    const action = actionCreator.createGame(data);

    this.emit(action);
  }

  handleMessage(action: ReceiveAction) {
    switch (action.type) {
      case "connected": {
        console.log("connected!!");
        this.enter("waiting");
        break;
      }
      case "enteredWaitingRoom": {
        console.log("waiting room 입장에 성공했습니다!!");
        break;
      }
      case "createdGameRoom": {
        this.navigator(`/game/${action.gameId}`, { replace: true });
        break;
      }
      default:
        break;
    }
  }

  enter(channel: string) {
    console.log(`${channel}: 에 입장하고 싶다고 요청합니다`);
    const action = actionCreator.enter(channel);
    this.emit(action);
  }
}

export default Session;
