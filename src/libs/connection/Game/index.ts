import CustomEvent from "../CustomEvent";
import messageCreator, { MessageType } from "./messages";
import Peer from "./Peer";
import Player from "./Player";

type GameState = {};

class Game {
  distroy: boolean = false;
  gameInfo?: GameInfo;
  gameState: GameState = {};
  myPlayer: Player;
  private peers = new Map<string, Peer>();

  private destroyGameEvent = new CustomEvent<boolean>();
  private gameStateUpdatedEvent = new CustomEvent<GameState>();
  private playersUpdatedEvent = new CustomEvent<Player[]>();

  constructor() {
    this.myPlayer = new Player();
  }

  private getAllPlayers(): Player[] {
    return [
      this.myPlayer,
      ...Array.from(this.peers.values()).map((peer) => peer.player),
    ];
  }

  private broadCast(message: MessageType) {
    this.peers.forEach((peer) =>
      peer.dataChannel?.send(JSON.stringify(message))
    );
  }

  private direct(to: string, message: any) {
    this.peers.get(to)?.dataChannel?.send(message);
  }

  close() {
    const disconnect = messageCreator.disconnect(
      this.gameInfo?.masterId === this.myPlayer.id
    );
    this.broadCast(disconnect);
  }

  initGame(id: string, name: string, gameInfo: GameInfo) {
    this.gameInfo = gameInfo;
    this.myPlayer.init(id, name, gameInfo.masterId === id);
    this.updatePlayers();
  }

  updatePlayers() {
    this.playersUpdatedEvent.trigger(this.getAllPlayers());
  }

  destroyGame() {
    this.destroyGameEvent.trigger(true);
  }

  listen = {
    on: {
      playersUpdated: (handler: { (players: Player[]): void }) => {
        this.playersUpdatedEvent.expose().on(handler);
      },
      destroyGame: (handler: { (destroy: boolean): void }) => {
        this.destroyGameEvent.expose().on(handler);
      },
    },
    off: {
      playersUpdated: (handler: { (players: Player[]): void }) => {
        this.playersUpdatedEvent.expose().off(handler);
      },
      destroyGame: (handler: { (destroy: boolean): void }) => {
        this.destroyGameEvent.expose().off(handler);
      },
    },
  };

  createPeer(id: string, name: string, isOffering: boolean): Peer {
    const peer = new Peer(
      id,
      name,
      this.gameInfo?.masterId === id,
      isOffering,
      () => this.deletePeer(id),
      () => this.destroyGame()
    );
    this.peers.set(id, peer);
    this.updatePlayers();
    return peer;
  }

  deletePeer(id: string) {
    this.peers.delete(id);
    this.updatePlayers();
  }

  getPeer(id: string): Peer | undefined {
    return this.peers.get(id);
  }
}

export default Game;
