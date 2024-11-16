
type PeerConnection = {
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
};

export class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localId: string;
  // private room?: Room;

  constructor(localId: string) {
    this.localId = localId;
  }

  async createPeerConnection(remoteId: string) {
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ]
    };

    const connection = new RTCPeerConnection(config);
    const dataChannel = connection.createDataChannel("gameChannel");
    
    this.setupDataChannel(dataChannel);
    this.peerConnections.set(remoteId, { connection, dataChannel });

    return connection;
  }

  private setupDataChannel(channel: RTCDataChannel) {
    channel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle incoming messages
      console.log("Received message:", data);
    };

    channel.onopen = () => {
      console.log("Data channel opened");
    };

    channel.onclose = () => {
      console.log("Data channel closed");
    };
  }

  async sendOffer(remoteId: string) {
    const peerConnection = await this.createPeerConnection(remoteId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  async handleAnswer(remoteId: string, answer: RTCSessionDescriptionInit) {
    const peer = this.peerConnections.get(remoteId);
    if (peer) {
      await peer.connection.setRemoteDescription(answer);
    }
  }

  async handleIceCandidate(remoteId: string, candidate: RTCIceCandidateInit) {
    const peer = this.peerConnections.get(remoteId);
    if (peer) {
      await peer.connection.addIceCandidate(candidate);
    }
  }
} 