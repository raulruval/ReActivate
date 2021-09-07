import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import Phaser from 'phaser';
import Marker from '~/gameobjects/marker';
import Constants from '~/constants';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';
import CustomButtom from '~/gameobjects/custom-button';

export default class WorkoutCardio extends AbstractPoseTrackerScene {
  private bodyPoints: Phaser.Physics.Arcade.Sprite[] = [];
  private markers: any[] = [];
  private triggerAction: boolean = true;
  private exp: number;
  private levelTime: number;
  private remainingTime: number;
  private timeConsumed: boolean;
  private audioScene: Phaser.Sound.BaseSound;
  private workoutStarted: boolean = false;
  private silhouetteImage: Phaser.GameObjects.Image;
  private buttonsReady: any[] = [];
  private buttonReadyLeft;
  private buttonReadyRight;
  private getReadyLeft = false;
  private getReadyRight = false;

  constructor() {
    super(Constants.SCENES.WorkoutCardio);
  }

  preload(): void {
    super.preload();
  }

  create(): void {
    super.create();

    // Get ready
    this.buttonReadyLeft = new CustomButtom(this, 340, 230, 'getReady', 'I', 69, -34.5);
    this.buttonsReady.push(this.buttonReadyLeft);

    this.buttonReadyRight = new CustomButtom(this, 940, 230, 'getReady', 'D', 69, -34.5);
    this.buttonsReady.push(this.buttonReadyRight);

    this.buttonsReady.forEach((button) => {
      this.add.existing(button);
      this.physics.world.enable(button);
      button.body.setAllowGravity(false);
    });
    this.silhouetteImage = this.add.image(640, 420, 'silhouette');
    this.silhouetteImage.setScale(0.7, 0.65);

    for (var i = 0; i < 33; i++) {
      let point = this.physics.add.sprite(-20, -20, 'point');
      this.add.existing(point);
      this.bodyPoints.push(point);
    }

    this.audioScene = this.sound.add(Constants.MUSIC.TRANCE, { loop: true });

    const testTxt: Phaser.GameObjects.Text = this.add
      .text(30, 50, 'test', { fontSize: '32px', color: '#FFFFFF' })
      .setInteractive();

    testTxt.on('pointerdown', () => {
      this.exp = 50;
      this.registry.set(Constants.REGISTER.EXP, this.exp);
      this.events.emit(Constants.EVENT.UPDATEEXP);
    });
    // Get ready markers
    this.buttonsReady.forEach((button) => {
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
                case 'I':
                  this.getReadyLeft = true;
                  break;
                case 'D':
                  this.getReadyRight = true;
                  break;
                default:
                  break;
              }
            }
            if (this.getReadyLeft && this.getReadyRight) {
              this.startWorkout();
            }
          },
          undefined,
          this,
        );
      });
    });

    // Time control
    this.levelTime = 1;
    this.remainingTime = 25;
    this.timeConsumed = false;
  }

  startWorkout() {
    this.createLayout();
    this.workoutStarted = true;
    this.silhouetteImage.destroy();
    this.buttonsReady.forEach((button) => {
      button.destroy();
    });
    this.audioScene.play();
    this.sound.pauseOnBlur = false;
  }

  movePoints(coords: IPoseLandmark[] | undefined) {
    if (this.bodyPoints && coords) {
      for (var i = 0; i < coords.length; i++) {
        this.bodyPoints[i].setPosition(coords[i].x * 1280, coords[i].y * 720);
      }
    }
  }

  createLayout(): void {
    let width: number = 50;
    let height: number = 150;

    for (var i = 1; i < 26; i++) {
      const marker = new Marker({
        scene: this,
        x: width,
        y: height,
        texture: Constants.MARKER.ID,
        id: i,
      });

      if (i % 6 == 0) {
        height = height + 170;
        width = 50;
      } else {
        if (i % 3 == 0) {
          width = width + 660;
        } else {
          width = width + 130; // 50 + 130 * 3 = 440
        }
      }

      this.markers.push(marker);
      this.bodyPoints.forEach((point) => {
        this.physics.add.overlap(
          marker,
          point,
          (marker: any) => {
            if (marker.getAnimationCreated()) {
              marker.destroyMarkerAnimation();
            }
          },
          undefined,
          this,
        );
      });
    }
  }

  update(time: number, delta: number): void {
    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: true,
        shouldDrawPoseLandmarks: true,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        this.movePoints(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks : undefined);
      },
      afterPaint: (poseTrackerResults) => {},
    });

    if (this.workoutStarted) {
      this.markers.forEach((marker) => {
        if (marker.id == 2) {
          if (marker.animationCreated) {
            marker.update();
          } else {
            if (this.triggerAction) marker.createAnimation();
          }
        }
      });
      this.triggerAction = false;

      // Time Management
      if (this.levelTime != Math.floor(Math.abs(time / 1000)) && !this.timeConsumed) {
        this.levelTime = Math.floor(Math.abs(time / 1000));
        this.remainingTime--;

        let minutes: number = Math.floor(this.remainingTime / 60);
        let seconds: number = Math.floor(this.remainingTime - minutes * 60);

        let clockText: string =
          Phaser.Utils.String.Pad(minutes, 2, '0', 1) + ':' + Phaser.Utils.String.Pad(seconds, 2, '0', 1);
        // Register
        this.registry.set(Constants.REGISTER.CLOCK, clockText);
        // Send to HUD
        this.events.emit(Constants.EVENT.CLOCK);

        // End of workout
        if (this.remainingTime == 0) {
          this.timeConsumed = true;
          this.sound.stopAll();
          this.scene.stop(Constants.SCENES.WorkoutCardio);
          this.scene.stop(Constants.SCENES.HUD);
          this.scene.wake(Constants.SCENES.Menu);
        }
      }
    }
  }
}
