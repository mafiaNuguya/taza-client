import actionCreator from "../actions/send";
import CustomEvent from "../CustomEvent";
import messageCreator, { MessageType } from "./messages";
import Peer from "./Peer";
import Player from "./Player";

type GameState = {};

class Game {
  socket: WebSocket;
  gameInfo?: GameInfo;
  gameState: GameState = {};
  myPlayer?: Player;
  peers = new Map<string, Peer>();
  playersUpdatedEvent = new CustomEvent<Player[]>();
  gameInfoUpdatedEvent = new CustomEvent<GameInfo>();
  gameDestroyedEvent = new CustomEvent<boolean>();

  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  init(id: string, name: string, gameInfo: GameInfo) {
    this.gameInfo = gameInfo;
    this.myPlayer = new Player(id, name, this.gameInfo?.masterId === id);
    this.updatePlayers();
  }

  private broadCast(message: MessageType) {
    this.peers.forEach((peer) =>
      peer.dataChannel?.send(JSON.stringify(message))
    );
  }

  private direct(to: string, message: any) {
    this.peers.get(to)?.dataChannel?.send(message);
  }

  private updatePlayers() {
    const players = [
      this.myPlayer!,
      ...Array.from(this.peers.values()).map((peer) => peer.player),
    ];
    this.playersUpdatedEvent.trigger(players);
  }

  private deleteAudio(id: string) {
    const $root = document.querySelector("#root");
    const $audio = document.getElementById(id);
    $audio && $root?.removeChild($audio);
  }

  private deleteAudioAll() {
    const $root = document.querySelector("#root");
    const $audios = document.querySelectorAll("audio");
    $audios.forEach(($audio) => $root?.removeChild($audio));
  }

  close() {
    this.deleteAudioAll();
    this.broadCast(messageCreator.disconnect(this.myPlayer?.id!));
  }

  onPlayersUpdated(handler: { (players: Player[]): void }) {
    this.playersUpdatedEvent.expose().on(handler);
  }

  removePlayersUpdated(handler: { (players: Player[]): void }) {
    this.playersUpdatedEvent.expose().off(handler);
  }

  onGameDestroyed(handler: { (destroyed: boolean): void }) {
    this.gameDestroyedEvent.expose().on(handler);
  }

  removeGameDestroyed(handler: { (destroyed: boolean): void }) {
    this.gameDestroyedEvent.expose().off(handler);
  }

  onGameInfoUpdated(handler: { (gameInfo: GameInfo): void }) {
    this.gameInfoUpdatedEvent.expose().on(handler);
  }

  removeGameInfoUpdated(handler: { (gameInfo: GameInfo): void }) {
    this.gameInfoUpdatedEvent.expose().off(handler);
  }

  getPeer(id: string): Peer | undefined {
    return this.peers.get(id);
  }

  createPeer(id: string, name: string, isOffering: boolean): Peer {
    const peer = new Peer(
      this,
      id,
      name,
      this.gameInfo?.masterId === id,
      isOffering
    );
    this.peers.set(id, peer);
    this.updatePlayers();
    return peer;
  }

  deletePeer(id: string) {
    this.peers.delete(id);
    this.deleteAudio(id);
    this.updatePlayers();
  }

  startGame() {
    this.socket.send(
      JSON.stringify(actionCreator.gameStart(this.gameInfo?.gameId!))
    );
    if (this.gameInfo) {
      this.gameInfo.onGame = true;
      this.gameInfoUpdatedEvent.trigger({ ...this.gameInfo });
    }
    this.broadCast(messageCreator.startGame());
  }
}

export default Game;
