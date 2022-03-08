const rtcHelper = {
  addTrack(pc: RTCPeerConnection, audioStream: MediaStream) {
    audioStream.getTracks().forEach((track) => pc.addTrack(track, audioStream));
  },
  async createOffer(pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  },
  async createAnswer(
    pc: RTCPeerConnection,
    description: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    await pc.setRemoteDescription(description);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  },
  async done(pc: RTCPeerConnection, description: RTCSessionDescriptionInit) {
    await pc.setRemoteDescription(description);
  },
};

export default rtcHelper;
