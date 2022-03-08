import { MessageType } from "./messages";
import Player from "./Player";

class Peer {
  player: Player;
  pc: RTCPeerConnection;
  dataChannel?: RTCDataChannel;

  constructor(
    id: string,
    name: string,
    isMaster: boolean,
    isOffering: boolean,
    private deleteThisPeer: () => any,
    private destroyGame: () => any
  ) {
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
        const parsed = JSON.parse(e.data);
        this.handleReceiveMessage(parsed);
      } catch (error) {
        console.log(error);
      }
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

  private handleReceiveMessage(message: MessageType) {
    switch (message.type) {
      case "disconnect":
        this.handleDisconnect(message);
        break;
      default:
        break;
    }
  }

  private handleDisconnect(message: MessageType) {
    this.pc.close();
    this.dataChannel?.close();
    this.deleteThisPeer();

    if (message.destroyGame) {
      this.destroyGame();
    }
  }
}

export default Peer;
