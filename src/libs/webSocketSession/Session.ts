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
    private update: (data: any) => void
  ) {}

  private emit(action: SendAction) {
    this.socket?.send(JSON.stringify(action));
  }

  private updater(channelType: ChannelType, data: any) {
    this.update({
      ...(channelType === "game" && { gameChannel: data }),
      ...(channelType === "waiting" && { waitingChannel: data }),
    });
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

  handleMessage(action: ReceiveAction) {
    switch (action.type) {
      case "connected": {
        console.log("connected!!");
        this.enter("waiting");
        break;
      }
      case "enteredWaitingRoom": {
        console.log("waiting room 입장에 성공했습니다!!");
        this.handleWaitingRoom(action.totalUser);
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

  handleWaitingRoom(totalUser: number, gameRoomList?: any) {
    this.updater("waiting", { totalUser });
  }
}

export default Session;
