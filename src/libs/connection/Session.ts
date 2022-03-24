import colorList from '../colorList';
import { ReceiveAction } from './actions/receive';
import actionCreator, { SendAction } from './actions/send';
import CustomEvent from './CustomEvent';

import Game from './Game/index';

class Session {
  socket: WebSocket;
  audioStream: MediaStream;
  gameId: string;
  id?: string;
  name?: string;
  game?: Game;
  gameUpdatedEvent = new CustomEvent<Game>();

  constructor(socket: WebSocket, audioStream: MediaStream, gameId: string) {
    this.socket = socket;
    this.audioStream = audioStream;
    this.gameId = gameId;
  }

  emit(action: SendAction) {
    this.socket.send(JSON.stringify(action));
  }

  close() {
    this.socket.close();
  }

  onGameUpdated(handler: { (game: Game): void }) {
    this.gameUpdatedEvent.expose().on(handler);
  }

  removeGameUpdated(handler: { (game: Game): void }) {
    this.gameUpdatedEvent.expose().off(handler);
  }

  updateGame(game: Game) {
    this.gameUpdatedEvent.trigger(game);
  }

  private async call(to: string, name: string, color: string) {
    if (!this.game) return;
    const { pc } = this.game.createPeer(to, name, true, color);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.emit(actionCreator.call(to, offer, this.game.myPlayer.color));
  }

  private async answer(
    to: string,
    name: string,
    description: RTCSessionDescriptionInit,
    color: string
  ) {
    if (!this.game) return;
    const { pc } = this.game.createPeer(to, name, false, color);
    await pc.setRemoteDescription(description);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.emit(actionCreator.answer(to, answer));
  }

  handleMessage(action: ReceiveAction) {
    switch (action.type) {
      case 'connected': {
        this.handleConnnected(action.sessionId, action.sessionName);
        break;
      }
      case 'entered': {
        this.handleEntered(
          action.gameInfo,
          action.enteredId,
          action.enteredName,
          action.memberIndex
        );
        break;
      }
      case 'enteredFail': {
        this.handleEnteredFail(action.gameId, action.reason);
        break;
      }
      case 'called': {
        this.handleCalled(action.from, action.name, action.description, action.color);
        break;
      }
      case 'answered': {
        this.handleAnswered(action.from, action.description);
        break;
      }
      case 'candidated': {
        this.handleCandidated(action.from, action.candidate);
        break;
      }
      default:
        break;
    }
  }

  private handleConnnected(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.emit(actionCreator.enter(this.gameId));
  }

  private async handleEntered(
    gameInfo: GameInfo,
    enteredId: string,
    enteredName: string,
    memberIndex: number
  ) {
    if (enteredId !== this.id) {
      return this.call(enteredId, enteredName, colorList[memberIndex]);
    }
    this.game = new Game(
      this.socket,
      this.audioStream,
      gameInfo,
      enteredId,
      enteredName,
      colorList[memberIndex]
    );
    this.updateGame(this.game);
  }

  private handleEnteredFail(gameId: string, reason: string) {
    this.socket.close(1000, `${gameId}: ${reason}`);
  }

  private handleCalled(
    from: string,
    name: string,
    description: RTCSessionDescriptionInit,
    color: string
  ) {
    this.answer(from, name, description, color);
  }

  private async handleAnswered(from: string, description: RTCSessionDescriptionInit) {
    const peer = this.game?.getPeer(from);

    if (peer) {
      const { pc } = peer;
      await pc.setRemoteDescription(description);
    }
  }

  async handleCandidated(from: string, candidate: RTCIceCandidateInit) {
    const peer = this.game?.getPeer(from);

    if (peer) {
      const { pc } = peer;
      await pc.addIceCandidate(candidate);
    }
  }
}

export default Session;
