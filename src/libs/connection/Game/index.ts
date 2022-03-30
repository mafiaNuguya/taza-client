import { MessageType } from './messages';
import CustomEvent from '../CustomEvent';
import Peer from './Peer';
import Player from './Player';

interface GameEventMap {
  gameState: GameState;
  gameInfo: GameInfo;
  gamePhase: GamePhase;
  players: Player[];
}

class Game {
  socket: WebSocket;
  audioStream: MediaStream;
  gameState: GameState = 'waiting';
  gamePhase: GamePhase = 'init';
  myPlayer: Player;
  gameInfo: GameInfo;
  peers = new Map<string, Peer>();
  gameEventMap = new Map<keyof GameEventMap, CustomEvent<any>>();

  constructor(
    socket: WebSocket,
    audioStream: MediaStream,
    gameInfo: GameInfo,
    id: string,
    name: string,
    color: string
  ) {
    this.socket = socket;
    this.audioStream = audioStream;
    this.gameInfo = gameInfo;
    this.myPlayer = new Player(id, name, this.gameInfo.masterId === id, color);
    this.myPlayer.startSoundDetect(audioStream);
  }

  addEventListener<T extends keyof GameEventMap>(
    type: T,
    listener: { (data: GameEventMap[T]): void }
  ) {
    let event = this.gameEventMap.get(type);

    if (!event) {
      event = new CustomEvent<GameEventMap[T]>();
      this.gameEventMap.set(type, event);
    }
    event.expose().on(listener);
  }

  removeEventListenr<T extends keyof GameEventMap>(
    type: T,
    listener: { (data: GameEventMap[T]): void }
  ) {
    this.gameEventMap.get(type)?.expose().off(listener);
  }

  update(type: keyof GameEventMap) {
    switch (type) {
      case 'players': {
        this.gameEventMap
          .get('players')
          ?.trigger([this.myPlayer, ...Array.from(this.peers.values()).map(peer => peer.player)]);
        break;
      }
      case 'gameInfo': {
        break;
      }
      case 'gamePhase': {
        break;
      }
      case 'gameState': {
        this.gameEventMap.get('gameState')?.trigger(this.gameState);
        break;
      }
      default:
        break;
    }
  }

  private deleteAudioAll() {
    const $root = document.querySelector('#root');
    const $audios = document.querySelectorAll('audio');
    $audios.forEach($audio => $root?.removeChild($audio));
  }

  leaveGame() {
    this.audioStream.getAudioTracks()[0].stop();
    this.deleteAudioAll();
    this.socket.close();
  }

  broadCast(message: MessageType) {
    this.peers.forEach(peer => peer.dataChannel?.send(JSON.stringify(message)));
  }

  direct(to: string, message: any) {
    this.peers.get(to)?.dataChannel?.send(JSON.stringify(message));
  }

  getPeer(id: string): Peer | undefined {
    return this.peers.get(id);
  }

  createPeer(id: string, name: string, isOffering: boolean, color: string): Peer {
    const player = new Player(id, name, this.gameInfo.masterId === id, color);
    const peer = new Peer(this, isOffering, player);
    this.peers.set(id, peer);
    this.update('players');
    return peer;
  }

  deletePeer(id: string) {
    this.peers.get(id)?.leave();
    this.update('players');
  }

  handleMessage(message: MessageType) {
    switch (message.type) {
      case 'startGame': {
        // this.handleStartGame();
        break;
      }
      default:
        break;
    }
  }

  // private handleStartGame() {
  //   this.gameState = 'inGame';
  //   this.update('gameState');
  // }
}

export default Game;
