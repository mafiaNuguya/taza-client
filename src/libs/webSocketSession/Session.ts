class Session {
  id?: string;
  name?: string;
  myPeer?: RTCPeerConnection;

  constructor(
    private socket: WebSocket | null,
    private updater: (data: any) => void
  ) {}

  connectSocket(socket: WebSocket) {
    if (!this.socket) this.socket = socket;
  }
  disconnectSocket() {
    if (this.socket) this.socket = null;
  }
}

export default Session;
