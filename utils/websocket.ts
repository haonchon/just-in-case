import { WebRTCService } from "./webrtc";

export class WebSocketService {
  private ws: WebSocket;
  private webrtc: WebRTCService;

  constructor(roomId: string, playerId: string) {
    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/rooms/${roomId}`);
    this.webrtc = new WebRTCService(playerId);
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "offer":
          const answer = await this.handleOffer(data.from, data.offer);
          this.send({
            type: "answer",
            to: data.from,
            answer
          });
          break;
          
        case "answer":
          await this.webrtc.handleAnswer(data.from, data.answer);
          break;
          
        case "ice-candidate":
          await this.webrtc.handleIceCandidate(data.from, data.candidate);
          break;
      }
    };
  }

  private async handleOffer(remoteId: string, offer: RTCSessionDescriptionInit) {
    const peerConnection = await this.webrtc.createPeerConnection(remoteId);
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  send(data: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
} 