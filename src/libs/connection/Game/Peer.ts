import actionCreator, { SendAction } from '../actions/send';
import { MessageType } from './messages';
import Player from './Player';

class Peer {
  player: Player;
  pc: RTCPeerConnection;
  dataChannel?: RTCDataChannel;

  constructor(
    public socket: WebSocket,
    isOffering: boolean,
    player: Player,
    myAudioStream: MediaStream
  ) {
    this.player = player;
    this.pc = this.createRTC(isOffering, myAudioStream);
  }

  createAudio(id: string): HTMLAudioElement {
    const $audio = document.createElement('audio');
    const $root = document.querySelector('#root');
    $audio.id = id!;
    $audio.autoplay = true;
    $root?.appendChild($audio);
    return $audio;
  }

  private createRTC(isOffering: boolean, myAudioStream: MediaStream): RTCPeerConnection {
    const messageHandler = async (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data);
        // this.handleMessage(message);
      } catch (error) {
        console.log(error);
      }
    };
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
        },
      ],
    });
    pc.addEventListener('icecandidate', e =>
      this.socket.send(JSON.stringify(actionCreator.candidate(this.player.id, e.candidate)))
    );
    pc.addEventListener('track', e => {
      const $audio = this.createAudio(this.player.id);
      $audio.srcObject = e.streams[0];
      this.player.startSoundDetect(e.streams[0]);
    });

    if (isOffering) {
      this.dataChannel = pc.createDataChannel('data');
      this.dataChannel.addEventListener('message', messageHandler);
    } else {
      pc.addEventListener('datachannel', e => {
        this.dataChannel = e.channel;
        this.dataChannel.addEventListener('message', messageHandler);
      });
    }
    myAudioStream.getTracks().forEach(track => pc.addTrack(track, myAudioStream));
    return pc;
  }

  // private handleDisconnect() {
  //   if (this.game.gameInfo?.masterId === this.player.id) {
  //     return this.game.gameDestroyedEvent.trigger(true);
  //   }
  //   this.game.deletePeer(this.player.id!);
  // }

  // private handleStartGame() {
  //   if (this.game.gameInfo) {
  //     this.game.gameInfo.onGame = true;
  //     this.game.gameInfoUpdatedEvent.trigger({ ...this.game.gameInfo });
  //   }
  // }
}

export default Peer;
