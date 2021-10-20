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
  private buttonExercise2;
  private buttonExercise3;
  private buttonRanking;
  private buttonStats;
  private buttonRight;
  private buttonLeft;
  private background;

  private bodyPoints: Phaser.Physics.Arcade.Sprite[] = [];
  private buttons: any[] = [];
  private touchingButton: boolean = false;

  create(): void {
    super.create();

    this.background = this.add.image(1280, 720 / 2, "room");

    this.buttonTutorial = new CustomButtom(this, 250, 220, 'button', 'Tutorial');
    this.buttons.push(this.buttonTutorial);

    this.buttonExercise1 = new CustomButtom(this, 645, 220, 'button', 'Cardio');
    this.buttons.push(this.buttonExercise1);

    this.buttonExercise2 = new CustomButtom(this, 1042, 220, 'button', 'Agilidad');
    this.buttons.push(this.buttonExercise2);

    this.buttonRight = new CustomButtom(this, 1220, 600, 'out', '►', 95, -48)
    this.buttons.push(this.buttonRight);

    this.buttonLeft = new CustomButtom(this, 60, 600, 'out', '◄', 95, -48)
    this.buttonLeft.setVisible(false);
    this.buttons.push(this.buttonLeft);

    this.buttonExercise3 = new CustomButtom(this, 250, 220, 'button', 'Next')
    this.buttonExercise3.setVisible(false);
    this.buttons.push(this.buttonExercise3);

    this.buttonRanking = new CustomButtom(this, 645, 220, 'button', 'Ranking')
    this.buttonRanking.setVisible(false);
    this.buttons.push(this.buttonRanking);

    this.buttonStats = new CustomButtom(this, 1042, 220, 'button', 'Stats')
    this.buttonStats.setVisible(false);
    this.buttons.push(this.buttonStats);


    this.buttons.forEach((button) => {
      this.add.existing(button);
      this.physics.world.enable(button);
      button.body.setAllowGravity(false);
    });

    for (var i = 0; i < 22; i++) {
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

                  break;
                case 'Cardio':
                  this.scene.start(Constants.SCENES.WorkoutCardio);
                  this.scene.start(Constants.SCENES.HUD);
                  this.scene.bringToTop(Constants.SCENES.HUD);
                  break;
                case 'Agilidad':
                  this.scene.start(Constants.SCENES.WorkoutAgilidad);
                  this.scene.start(Constants.SCENES.HUD);
                  this.scene.bringToTop(Constants.SCENES.HUD);
                  break;
                case '►':
                  this.tweens.add({
                    targets: this.background,
                    x: 0,
                    duration: 3000,
                    ease: 'Power2',
                    completeDelay: 3000
                  });

                  this.buttonRight.setVisible(false);
                  this.buttonTutorial.setVisible(false);
                  this.buttonExercise1.setVisible(false);
                  this.buttonExercise2.setVisible(false);
                  this.buttonLeft.setVisible(true);
                  this.buttonExercise3.setVisible(true);
                  this.buttonRanking.setVisible(true);
                  this.buttonStats.setVisible(true);
                  // this.time.addEvent({
                  //   delay: 2500,
                  //   callback: () => {

                  //   },
                  //   loop: true
                  // })

                //   this.tweens.add({
                //     targets: endScreen,
                //     duration: 500,
                //     alpha: 1
                // });

                  break;
                case '◄':
                  this.tweens.add({
                    targets: this.background,
                    x: 1280,
                    duration: 3000,
                    ease: 'Power2',
                    completeDelay: 3000
                  });
                  this.buttonTutorial.setVisible(true);
                  this.buttonExercise1.setVisible(true);
                  this.buttonExercise2.setVisible(true);
                  this.buttonLeft.setVisible(false);
                  this.buttonRight.setVisible(true);
                  this.buttonExercise3.setVisible(false);
                  this.buttonRanking.setVisible(false);
                  this.buttonStats.setVisible(false);
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
      for (var i = 0; i < this.bodyPoints.length; i++) {
        this.bodyPoints[i].setPosition(coords[i + 11].x * 1280, coords[i + 11].y * 720);
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
      },
    });
    this.touchingButton = false;

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
