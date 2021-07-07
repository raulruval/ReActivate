import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import Phaser from 'phaser';
import CustomBottom from '~/objects/custom-button';

export default class WorkoutScene extends AbstractPoseTrackerScene {
  constructor() {
    super('workout-scene');
  }

  preload(): void {
    super.preload();
    this.load.image('button', 'assets/img/button.png');
    this.load.image('buttonSelected', 'assets/img/buttonSelected.png');

  }

  private buttonTutorial;

  create(): void {
    super.create();
    this.buttonTutorial = new CustomBottom(this, 200, 200, 'button', 'buttonSelected', 'Tutorial');
    this.add.existing(this.buttonTutorial);
    this.buttonTutorial.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        console.log('buttom tutorial')
    });

  }

  update(time: number, delta: number): void {
    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: true,
        shouldDrawPoseLandmarks: true,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        poseTrackerResults.poseLandmarks?.forEach((poseLandmarks) => {
          
          //if(poseLandmarks.y > 200-50 || poseLandmarks.y < 200+50 && poseLandmarks.y > 200-50 || poseLandmarks.y < 200+50){
         // }
        })
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
