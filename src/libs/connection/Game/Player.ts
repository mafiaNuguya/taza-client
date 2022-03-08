import CustomEvent from "../CustomEvent";

class Player {
  id?: string;
  name?: string;
  isMaster?: boolean;
  MIN_DECIBELS = -55;
  private audioDetectedEvent = new CustomEvent<boolean>();

  constructor(id?: string, name?: string, isMaster?: boolean) {
    this.init(id, name, isMaster);
  }

  init(id?: string, name?: string, isMaster?: boolean) {
    this.id = id;
    this.name = name;
    this.isMaster = isMaster;
  }

  onAudioDetected(handler: { (detected: boolean): void }) {
    this.audioDetectedEvent.expose().on(handler);
  }

  removeAudioDetected(handler: { (detected: boolean): void }) {
    this.audioDetectedEvent.expose().off(handler);
  }

  startSoundDetect(audioStream: MediaStream) {
    const audioCtx = new AudioContext();
    const audioStreamSource = audioCtx.createMediaStreamSource(audioStream);
    const analyser = audioCtx.createAnalyser();
    analyser.minDecibels = this.MIN_DECIBELS;
    audioStreamSource.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const domainData = new Uint8Array(bufferLength);

    const detectSound = () => {
      let detectFalseTriggered = false;
      analyser.getByteFrequencyData(domainData);

      for (let i = 0; i < bufferLength; i++) {
        if (domainData[i] > 0) {
          this.audioDetectedEvent.trigger(true);
          break;
        }
        if (!detectFalseTriggered) {
          this.audioDetectedEvent.trigger(false);
          detectFalseTriggered = true;
        }
      }
      window.requestAnimationFrame(detectSound);
    };
    window.requestAnimationFrame(detectSound);
  }
}

export default Player;
