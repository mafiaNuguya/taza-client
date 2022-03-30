import Game from '.';
import actionCreator from '../actions/send';
import Player from './Player';

class Peer {
  player: Player;
  pc: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  leaveWorks = new Set<(() => void) | undefined>();
  removeAudio?: () => void;
  removeTrack?: () => void;

  constructor(public game: Game, isOffering: boolean, player: Player) {
    this.player = player;
    this.pc = this.createRTC(isOffering, this.game.audioStream);
  }

  leave() {
    this.removeAudio?.();
    this.removeTrack?.();
    this.pc.close();
    this.dataChannel?.close();
    this.game.peers.delete(this.player.id);
  }

  createAudio(id: string): HTMLAudioElement {
    const $audio = document.createElement('audio');
    const $root = document.querySelector('#root');
    $audio.id = id!;
    $audio.autoplay = true;
    $root?.appendChild($audio);
    this.removeAudio = () => $root?.removeChild($audio);
    return $audio;
  }

  private createRTC(isOffering: boolean, myAudioStream: MediaStream): RTCPeerConnection {
    const messageHandler = async (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data);
        this.game.handleMessage(message);
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
      this.game.socket.send(JSON.stringify(actionCreator.candidate(this.player.id, e.candidate)))
    );
    pc.addEventListener('track', e => {
      const $audio = this.createAudio(this.player.id);
      $audio.srcObject = e.streams[0];
      this.player.startSoundDetect(e.streams[0]);
    });
    pc.addEventListener('connectionstatechange', () => {
      switch (pc.connectionState) {
        case 'connected': {
          console.log('$connected');
          break;
        }
        case 'closed': {
          console.log('$closed');
          break;
        }
        case 'connecting': {
          console.log('$connecting');
          break;
        }
        case 'disconnected': {
          console.log('$disconnected');
          break;
        }
        case 'failed': {
          console.log('$failed');
          break;
        }
        default:
          break;
      }
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
    myAudioStream.getTracks().forEach(track => {
      const sender = pc.addTrack(track, myAudioStream);
      this.removeTrack = () => pc.removeTrack(sender);
    });
    return pc;
  }
}

export default Peer;
