import Game from ".";
import { MessageType } from "./messages";
import Player from "./Player";

class Peer {
  game: Game;
  player: Player;
  pc: RTCPeerConnection;
  dataChannel?: RTCDataChannel;

  constructor(
    game: Game,
    id: string,
    name: string,
    isMaster: boolean,
    isOffering: boolean
  ) {
    this.game = game;
    this.player = new Player(id, name, isMaster);
    this.pc = this.createRTC(isOffering);
  }

  private createAudio(): HTMLAudioElement {
    const $audio = document.createElement("audio");
    const $root = document.querySelector("#root");
    $audio.id = this.player.id!;
    $audio.autoplay = true;
    $root?.appendChild($audio);
    return $audio;
  }

  private createRTC(isOffering: boolean): RTCPeerConnection {
    const messageHandler = async (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data);
        this.handleMessage(message);
      } catch (error) {}
    };
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });
    pc.addEventListener("track", (e) => {
      const $audio = this.createAudio();
      $audio.srcObject = e.streams[0];
      this.player.startSoundDetect(e.streams[0]);
    });

    if (isOffering) {
      this.dataChannel = pc.createDataChannel("data");
      this.dataChannel.addEventListener("message", messageHandler);
    } else {
      pc.addEventListener("datachannel", (e) => {
        this.dataChannel = e.channel;
        this.dataChannel.addEventListener("message", messageHandler);
      });
    }
    return pc;
  }

  private handleMessage(message: MessageType) {
    switch (message.type) {
      case "disconnect": {
        this.handleDisconnect(message.from);
        break;
      }
      default:
        break;
    }
  }

  private handleDisconnect(from: string) {
    if (this.game.gameInfo?.masterId === from)
      return this.game.gameDestroyedEvent.trigger(true);
    this.game.deletePeer(from);
  }
}

export default Peer;
