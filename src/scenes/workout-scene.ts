import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import Phaser from 'phaser';
import CustomButtom from '~/objects/custom-button';

export default class WorkoutScene extends AbstractPoseTrackerScene {
  constructor() {
    super('workout-scene');
  }

  preload(): void {
    super.preload();
    this.load.image('rec', 'assets/img/rec.png');
    this.load.image('button', 'assets/img/button.png');
    this.load.image('ball','/assets/sprites/shinyball.png');
  }

  private buttonTutorial;
  private buttonExercise1;
  private handPalm;
  private buttons: any[] = [];

  create(): void {
    super.create();

    this.buttonTutorial = new CustomButtom(this, 200, 200, 'button', 'Tutorial');
    this.buttons.push(this.buttonTutorial);

    this.buttonExercise1 = new CustomButtom(this, 200, 350, 'button', 'Cardio');
    this.buttons.push(this.buttonExercise1);

    this.buttons.forEach((button) => {
      this.add.existing(button);
      this.physics.world.enable(button);
      button.body.setAllowGravity(false);
    });

    this.handPalm = this.physics.add.sprite(500, 500, 'rec');
    this.add.existing(this.handPalm);
  }

  moveHand(coords) {
    if (this.handPalm && coords) {
      this.physics.moveTo(this.handPalm, coords.x * 1280, coords.y * 720, 800);
    }
  }

  update(time: number, delta: number): void {
    this.buttons.forEach((button) => {
      this.physics.add.overlap(
        button,
        this.handPalm,
        function (this) {
          button.animateToFill(false);
           const buttonIsFull: CustomButtom = button.buttonIsFull();
          if (buttonIsFull) {
            switch (button.getText()) {
              case 'Tutorial':
                this.scene.start('hello-world-scene');
                break;
              case 'Cardio':
                this.scene.start('first-workout-scene');
                break;

              default:
                break;
            }
          }
        },
        undefined,
        this,
      );
      if (this.handPalm.body.touching.none) {
        button.animateToEmpty(false);
      }
    });

    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: true,
        shouldDrawPoseLandmarks: true,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        this.moveHand(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks[20] : undefined);
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
