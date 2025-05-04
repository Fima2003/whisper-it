export class Session {
  private ms: MediaStream | null;
  private pc: RTCPeerConnection | null;
  private dc: RTCDataChannel | null;
  private muted: boolean;

  ontrack?: (event: RTCTrackEvent) => void;
  onconnectionstatechange?: (state: RTCPeerConnectionState) => void;
  onopen?: () => void;
  onmessage?: (data: any) => void;
  onerror?: (error: Error) => void;

  constructor() {
    this.ms = null;
    this.pc = null;
    this.dc = null;
    this.muted = false;
  }

  async startTranscription(
    stream: MediaStream,
    lang: string
  ): Promise<void> {
    await this.startInternal(stream, lang);
  }

  stop(): void {
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.ms) {
      this.ms.getTracks().forEach((t) => t.stop());
      this.ms = null;
    }
    this.muted = false;
  }

  mute(muted: boolean): void {
    this.muted = muted;
    this.pc?.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.enabled = !muted;
      }
    });
  }

  private async startInternal(stream: MediaStream, lang: string): Promise<void> {
    this.ms = stream;
    this.pc = new RTCPeerConnection();
    this.pc.ontrack = (e) => this.ontrack?.(e);
    this.pc.addTrack(stream.getTracks()[0]);
    this.pc.onconnectionstatechange = () =>
      this.onconnectionstatechange?.(this.pc!.connectionState);
    this.dc = this.pc.createDataChannel("");
    this.dc.onopen = () => this.onopen?.();
    this.dc.onmessage = (e) => this.onmessage?.(JSON.parse(e.data));

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    try {
      const answer = await this.signal(offer, lang);
      await this.pc.setRemoteDescription(answer);
    } catch (e) {
      this.onerror?.(e as Error);
    }
  }

  private async signal(
    offer: RTCSessionDescriptionInit,
    lang: string
  ): Promise<RTCSessionDescriptionInit> {
    const urlRoot = "https://api.openai.com";
    const realtimeUrl = `${urlRoot}/v1/realtime`;
    let sdpResponse: Response;

    const sessionResponse = await fetch(`/api/ephemeralKey?lang=${encodeURIComponent(lang)}`);
    if (!sessionResponse.ok) {
      throw new Error("Failed to request session token");
    }
    const sessionData = await sessionResponse.json();
    const clientSecret = sessionData.client_secret.value;
    console.log(clientSecret);
    sdpResponse = await fetch(`${realtimeUrl}?intent=translations`, {
      method: "POST",
      body: offer.sdp!,
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        "Content-Type": "application/sdp",
      },
    });
    if (!sdpResponse.ok) {
      throw new Error("Failed to signal");
    }

    return { type: "answer", sdp: await sdpResponse.text() };
  }

  sendMessage(message: any): void {
    this.dc?.send(JSON.stringify(message));
  }
}
