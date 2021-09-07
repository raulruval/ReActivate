import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import CustomButtom from '~/gameobjects/custom-button';
import Constants from '~/constants';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';

export default class Menu extends AbstractPoseTrackerScene {
  constructor() {
    super(Constants.SCENES.Menu);
  }

  private buttonTutorial;
  private buttonExercise1;
  private bodyPoints: Phaser.Physics.Arcade.Sprite[] = [];
  private buttons: any[] = [];
  private touchingButton: boolean = false;

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

    for (var i = 0; i < 33; i++) {
      let point = this.physics.add.sprite(-20, -20, 'point');
      this.add.existing(point);
      this.bodyPoints.push(point);
    }

    this.buttons.forEach((button) => {
      this.bodyPoints.forEach((point) => {
        this.physics.add.overlap(
          button,
          point,
          function (this) {
            button.animateToFill(false);
            this.touchingButton = true;
            const buttonIsFull: CustomButtom = button.buttonIsFull();
            if (buttonIsFull) {
              switch (button.getText()) {
                case 'Tutorial':
                  this.scene.start('hello-world-scene');
                  break;
                case 'Cardio':
                  this.scene.start(Constants.SCENES.WorkoutCardio);
                  this.scene.start(Constants.SCENES.HUD);
                  this.scene.bringToTop(Constants.SCENES.HUD);
                  this.scene.sleep(Constants.SCENES.Menu);
                  break;
                default:
                  break;
              }
            }
          },
          undefined,
          this,
        );
      });
    });
  }

  movePoints(coords: IPoseLandmark[] | undefined) {
    if (this.bodyPoints && coords) {
      for (var i = 0; i < coords.length; i++) {
        this.bodyPoints[i].setPosition(coords[i].x * 1280, coords[i].y * 720);
      }
    }
  }

  update(time: number, delta: number): void {
    if (!this.touchingButton) {
      this.buttons.forEach((button) => {
        this.bodyPoints.forEach((point) => {
          if (point.body && point.body.touching.none) {
            button.animateToEmpty(false);
          }
        });
      });
    }
    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: true,
        shouldDrawPoseLandmarks: true,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        this.movePoints(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks : undefined);

        // This function will be called before refreshing the canvas texture.
        // Anything you add to the canvas texture will be rendered.
      },
      afterPaint: (poseTrackerResults) => {
        // This function will be called after refreshing the canvas texture.
        this.touchingButton = false;
      },
    });

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
