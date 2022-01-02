import Phaser from 'phaser';
import PoseTracker from '~/pose-tracker-engine/pose-tracker';
import { IPoseTrackerResults } from '~/pose-tracker-engine/types/pose-tracker-results.interface';
import { IOnPoseTrackerResultsUpdate } from '~/pose-tracker-engine/types/on-pose-tracker-results-update.interface';

export default abstract class AbstractPoseTrackerScene extends Phaser.Scene {
  private poseTrackerCanvasTexture!: Phaser.Textures.CanvasTexture;
  private poseTracker!: PoseTracker;
  private poseTrackerResults: IPoseTrackerResults | undefined;

  protected constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  preload(): void {
    this.poseTracker = new PoseTracker(
      document.querySelector('#input-video'),
      {
        width: this.scale.width,
        height: this.scale.height,
        selfieMode: true,
        upperBodyOnly: false,
        smoothLandmarks: true,
        minDetectionConfidence: 0.3,
        minTrackingConfidence: 0.3,
      },
      (results: IPoseTrackerResults) => (this.poseTrackerResults = results),
    );

    // Create a texture canvas to draw the camera frames/joints on it later
    this.poseTrackerCanvasTexture = this.textures.createCanvas('camera-frame', this.scale.width, this.scale.height);
  }

  create(): void {
    // Add the texture to the scene for render
    this.add.image(0, 0, this.poseTrackerCanvasTexture).setOrigin(0, 0);

    // Clean resources/free camera acquisition when exit from the scene
    this.events.once('shutdown', () => {
      this.textures.remove('camera-frame');
      this.poseTracker.shutdown();
      this.poseTrackerResults = undefined;
    });
  }

  update(time: number, delta: number, onPoseTrackerResultsUpdate?: IOnPoseTrackerResultsUpdate): void {
    if (!this.poseTrackerResults) {
      return;
    }
    if (this.poseTrackerCanvasTexture && this.poseTrackerCanvasTexture.context) {
      this.poseTracker.drawResults(
        this.poseTrackerCanvasTexture.context,
        this.poseTrackerResults,
        onPoseTrackerResultsUpdate?.renderElementsSettings,
      );


      onPoseTrackerResultsUpdate?.beforePaint(this.poseTrackerResults, this.poseTrackerCanvasTexture);
      this.poseTrackerCanvasTexture.refresh();
      onPoseTrackerResultsUpdate?.afterPaint(this.poseTrackerResults);
    }
    // Set it to undefined to not draw anything again until new pose tracker results are obtained
    this.poseTrackerResults = undefined;
  }
}
