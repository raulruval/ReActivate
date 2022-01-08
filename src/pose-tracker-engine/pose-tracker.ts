import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils/drawing_utils';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose/pose';
import { IPoseSettings } from '~/pose-tracker-engine/types/pose-settings.interface';
import { ISize } from '~/types/size.interface';
import { IPoseTrackerResults } from '~/pose-tracker-engine/types/pose-tracker-results.interface';
import Camera from '~/pose-tracker-engine/camera';
import { IPoseTrackerRenderElementsSettings } from '~/pose-tracker-engine/types/pose-tracker-dender-elements-settings.interface';

export default class PoseTracker {
  private pose: Pose;
  private camera: Camera | null;

  constructor(
    videoEl: HTMLVideoElement | null,
    settings: IPoseSettings & ISize,
    onResults: (results: IPoseTrackerResults) => void,
  ) {
    if (!videoEl) {
      videoEl = document.createElement('video');
      videoEl.id = 'input-video';
    }

    // This is for clearing any existing cache from the video element
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();

    this.pose = new Pose({
      locateFile: (file: string): string => `./vendor/@mediapipe/pose/${file}`,
    });
    this.pose.setOptions(settings);
    this.pose.onResults(onResults);
    this.camera = new Camera(
      videoEl,
      async (): Promise<void> => {
        await this.pose?.send({ image: videoEl });
      },
    );
    this.camera.start(settings.width, settings.height);
  }

  public shutdown(): void {
    document.querySelector('body > script[src$="pose_solution_packed_assets_loader.js"]')?.remove();
    document.querySelector('body > script[src$="pose_solution_wasm_bin.js"]')?.remove();
    this.camera?.stop();
    this.camera = null;
    this.pose.close();
    this.pose = null;
  }

  public drawResults(
    ctx: CanvasRenderingContext2D,
    results: IPoseTrackerResults,
    renderElementsSettings?: IPoseTrackerRenderElementsSettings,
  ): void {
    if (!ctx?.canvas) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (renderElementsSettings?.shouldDrawFrame && results.image) {
      ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    if (renderElementsSettings?.shouldDrawPoseLandmarks && results.poseLandmarks) {
      ctx.save();
      //drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
      //drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
      ctx.restore();
    }
  }
}
