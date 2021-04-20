import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';

export default class WorkoutScene extends AbstractPoseTrackerScene {
  constructor() {
    super('workout-scene');
  }

  preload(): void {
    super.preload();
  }

  create(): void {
    super.create();

    // Some simple way to move to another scene
    this.input.once('pointerdown', (event: unknown) => {
      this.scene.start('hello-world-scene');
    });
  }

  update(time: number, delta: number): void {
    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: true,
        shouldDrawPoseLandmarks: true,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        // This function will be called before refreshing the canvas texture.
        // Anything you add to the canvas texture will be rendered.
      },
      afterPaint: (poseTrackerResults) => {
        // This function will be called after refreshing the canvas texture.
      },
    });

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
