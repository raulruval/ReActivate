export default class Camera {
  private lastTime = 0;
  private stream: MediaStream | undefined;

  constructor(private videoEl: HTMLVideoElement, private onFrame: () => Promise<void>) {}

  public start(width: number, height: number): void {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('No navigator.mediaDevices.getUserMedia exists.');
    }

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'user', width, height },
      })
      .then((mediaStream) => {
        this.stream = mediaStream;
        this.videoEl.srcObject = this.stream;
        this.videoEl.onloadedmetadata = (): void => {
          this.videoEl.play().then(() => window.requestAnimationFrame(() => this.requestAnimationFrame()));
        };
      })
      .catch((err) => {
        console.error('Failed to acquire camera feed: ' + err);
        alert('Failed to acquire camera feed: ' + err);
        throw err;
      });
  }

  public stop(): void {
    const videoTracks = this.stream?.getVideoTracks();
    if (!videoTracks) {
      return;
    }

    for (const videoTrack of videoTracks) {
      videoTrack.enabled = false;
      videoTrack.stop();
    }
  }

  private requestAnimationFrame(): void {
    if (!this.stream?.active) {
      // The track has been stopped, so stop listening for requestAnimationFrames
      return;
    }

    let onFramePromise;
    if (!this.videoEl.paused && this.videoEl.currentTime !== this.lastTime) {
      this.lastTime = this.videoEl.currentTime;
      onFramePromise = this.onFrame();
    }

    if (onFramePromise) {
      onFramePromise.then(() => window.requestAnimationFrame(() => this.requestAnimationFrame()));
    } else {
      window.requestAnimationFrame(() => this.requestAnimationFrame());
    }
  }
}
