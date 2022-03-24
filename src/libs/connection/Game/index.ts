import { SendAction } from '../actions/send';
import CustomEvent from '../CustomEvent';
import messageCreator, { MessageType } from './messages';
import Peer from './Peer';
import Player from './Player';

interface GameEventMap {
  gameState: GameState;
  gameInfo: GameInfo;
  gamePhase: GamePhase;
  players: Player[];
}

class Game {
  gameState: GameState = 'waiting';
  gameInfo: GameInfo;
  gamePhase: GamePhase = 'init';
  myPlayer: Player;
  audioStream: MediaStream;
  peers = new Map<string, Peer>();
  players = new Map<string, Player>();
  gameEventMap = new Map<keyof GameEventMap, CustomEvent<any>>();

  constructor(
    public socket: WebSocket,
    audioStream: MediaStream,
    gameInfo: GameInfo,
    id: string,
    name: string,
    myColor: string
  ) {
    this.gameInfo = gameInfo;
    this.audioStream = audioStream;
    this.myPlayer = new Player(id, name, gameInfo.masterId === id, myColor);
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
    const event = this.gameEventMap.get(type);

    if (event) {
      event?.expose().off(listener);
    }
  }

  update(type: keyof GameEventMap) {
    switch (type) {
      case 'players': {
        this.gameEventMap.get('players')?.trigger(this.getPlayers());
        break;
      }
      case 'gameInfo': {
        break;
      }
      case 'gamePhase': {
        break;
      }
      case 'gameState': {
        break;
      }
      default:
        break;
    }
  }

  getPlayers(): Player[] {
    return [this.myPlayer, ...Array.from(this.players.values())];
  }

  private broadCast(message: MessageType) {
    this.peers.forEach(peer => peer.dataChannel?.send(JSON.stringify(message)));
  }

  private direct(to: string, message: any) {
    this.peers.get(to)?.dataChannel?.send(message);
  }

  createAudio(id: string): HTMLAudioElement {
    const $audio = document.createElement('audio');
    const $root = document.querySelector('#root');
    $audio.id = id!;
    $audio.autoplay = true;
    $root?.appendChild($audio);
    return $audio;
  }

  deleteAudio(id: string) {
    const $root = document.querySelector('#root');
    const $audio = document.getElementById(id);
    $audio && $root?.removeChild($audio);
  }

  deleteAudioAll() {
    const $root = document.querySelector('#root');
    const $audios = document.querySelectorAll('audio');
    $audios.forEach($audio => $root?.removeChild($audio));
  }

  close() {
    this.audioStream.getAudioTracks()[0].stop();
    this.deleteAudioAll();
    this.broadCast(messageCreator.disconnect(this.myPlayer?.id!));
  }

  getPeer(id: string): Peer | undefined {
    return this.peers.get(id);
  }

  private createPlayer(id: string, name: string, color: string): Player {
    const player = new Player(id, name, this.gameInfo.masterId === id, color);
    this.players.set(id, player);
    this.update('players');
    return player;
  }

  createPeer(id: string, name: string, isOffering: boolean, color: string): Peer {
    const player = this.createPlayer(id, name, color);
    const peer = new Peer(this.socket, isOffering, player, this.audioStream);
    this.peers.set(id, peer);
    return peer;
  }
}

export default Game;
