import { ReceiveAction } from "./actions/receive";
import actionCreator, { SendAction } from "./actions/send";

import Game from "./Game/index";
import rtcHelper from "./rtcHelper";

class Session {
  socket: WebSocket;
  audioStream: MediaStream;
  id?: string;
  name?: string;
  currentChannel?: string;
  game: Game;

  constructor(socket: WebSocket, audioStream: MediaStream) {
    this.socket = socket;
    this.audioStream = audioStream;
    this.game = new Game(socket);
  }

  private emit(action: SendAction) {
    this.socket.send(JSON.stringify(action));
  }

  private async call(to: string, name: string) {
    const peer = this.game.createPeer(to, name, true);

    if (peer) {
      const { pc } = peer;
      pc.addEventListener("icecandidate", (e) =>
        this.emit(actionCreator.candidate(to, e.candidate))
      );
      rtcHelper.addTrack(pc, this.audioStream);
      const offer = await rtcHelper.createOffer(pc);
      this.emit(actionCreator.call(to, offer));
    }
  }

  private async answer(
    to: string,
    name: string,
    description: RTCSessionDescriptionInit
  ) {
    const peer = this.game.createPeer(to, name, false);

    if (peer) {
      const { pc } = peer;
      pc.addEventListener("icecandidate", (e) =>
        this.emit(actionCreator.candidate(to, e.candidate))
      );
      rtcHelper.addTrack(pc, this.audioStream);
      const answer = await rtcHelper.createAnswer(pc, description);
      this.emit(actionCreator.answer(to, answer));
    }
  }

  async connectionDone(from: string, description: RTCSessionDescriptionInit) {
    const peer = this.game.getPeer(from);

    if (peer) {
      try {
        const { pc } = peer;
        await rtcHelper.done(pc, description);
      } catch (error) {
        console.log(error);
        console.log("candidate fail");
      }
    }
  }

  close() {
    this.socket.close();
    this.audioStream.getAudioTracks()[0].stop();
  }

  handleMessage(action: ReceiveAction) {
    switch (action.type) {
      case "connected": {
        this.handleConnnected(
          action.sessionId,
          action.sessionName,
          action.gameInfo
        );
        break;
      }
      case "entered": {
        this.handleEntered(action.gameId, action.enteredId, action.enteredName);
        break;
      }
      case "enteredFail": {
        this.handleEnteredFail(action.gameId, action.reason);
        break;
      }
      case "called": {
        this.handleCalled(action.from, action.name, action.description);
        break;
      }
      case "answered": {
        this.handleAnswered(action.from, action.description);
        break;
      }
      case "candidated": {
        this.handleCandidated(action.from, action.candidate);
        break;
      }
      default:
        break;
    }
  }

  private handleConnnected(id: string, name: string, gameInfo: GameInfo) {
    this.id = id;
    this.name = name;
    this.game.init(id, name, gameInfo);
    this.emit(actionCreator.enter(gameInfo.gameId));
  }

  private async handleEntered(
    gameId: string,
    enteredId: string,
    enteredName: string
  ) {
    if (enteredId === this.id && enteredName === this.name) {
      this.game.myPlayer?.startSoundDetect(this.audioStream);
      return;
    }
    this.currentChannel = gameId;
    this.call(enteredId, enteredName);
  }

  private handleEnteredFail(gameId: string, reason: string) {
    this.socket.close(1000, `${gameId}: ${reason}`);
  }

  private handleCalled(
    from: string,
    name: string,
    description: RTCSessionDescriptionInit
  ) {
    this.answer(from, name, description);
  }

  private handleAnswered(from: string, description: RTCSessionDescriptionInit) {
    this.connectionDone(from, description);
  }

  async handleCandidated(from: string, candidate: RTCIceCandidateInit) {
    const peer = this.game.getPeer(from);

    if (peer) {
      const { pc } = peer;
      try {
        await pc.addIceCandidate(candidate);
      } catch (error) {
        console.log("fail to candidate");
      }
    }
  }
}

export default Session;
