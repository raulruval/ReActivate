import Phaser from 'phaser';
import Constants from '~/constants';
import CustomButtom from '~/gameobjects/custom-button';
import Marker from '~/gameobjects/marker';
import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';

export default class WorkoutAgilidad extends AbstractPoseTrackerScene {
  constructor() {
    super(Constants.SCENES.WorkoutAgilidad);
  }
  private markers: any[] = [];
  private bodyPoints: Phaser.Physics.Arcade.Sprite[] = [];
  private exp: number = 0;
  private levelTime: number;
  private remainingTime: number;
  private timeConsumed: boolean;
  private audioScene: Phaser.Sound.BaseSound;
  private workoutStarted: boolean = false;
  private silhouetteImage: Phaser.GameObjects.Image;
  private buttonsReady: any[] = [];
  private buttonReadyLeft;
  private buttonReadyRight;
  private getReadyLeft: boolean = false;
  private getReadyRight: boolean = false;
  private buttonExitMarker;

  create(): void {
    super.create();


    /************** Buttons Init *********/
    this.buttonExitMarker = new CustomButtom(this, 1100, 44, 'out', '', 69, -34.5);
    this.buttonExitMarker.setScale(0.8, 0.85);
    this.add.existing(this.buttonExitMarker);
    this.physics.world.enable(this.buttonExitMarker);
    this.buttonExitMarker.body.setAllowGravity(false);

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
    // body points
    for (var i = 0; i < 33; i++) {
      let point = this.physics.add.sprite(-20, -20, 'point');
      this.add.existing(point);
      this.bodyPoints.push(point);
    }

    /*****************************************/

    this.audioScene = this.sound.add(Constants.MUSIC.TRANCE, { loop: true });

    /************** Exit workout *************/
    this.bodyPoints.forEach((point) => {
      this.physics.add.overlap(
        this.buttonExitMarker,
        point,
        function (this) {
          this.buttonExitMarker.animateToFill(false);
          this.touchingButton = true;
          const buttonIsFull: CustomButtom = this.buttonExitMarker.buttonIsFull();
          if (buttonIsFull) {
            this.stopScene();
          }
        },
        undefined,
        this,
      );
    });
    /***************************************** */

    /************** Get ready markers ******** */
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
    /***************************************** */

    /************** Time control ************** */
    this.levelTime = 1;
    this.remainingTime = 8 * 60;
    this.timeConsumed = false;
    this.registry.set(Constants.REGISTER.EXP, this.exp);
    /***************************************** */

  }

  startWorkout() {
    this.createLayout();

    const particles = this.add.particles('particle-red');

    const emitter = particles.createEmitter({
      speed: 80,
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
    });

    const ball = this.physics.add.image(400, 100, 'logo');

    ball.setVelocity(100, 200);
    ball.setBounce(1, 1);
    ball.setCollideWorldBounds(true);
    ball.setRotation(360);
    ball.setVisible(false);

    emitter.startFollow(ball);

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
      for (var i = 0; i < this.bodyPoints.length; i++) {
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
        texture: Constants.TRANSPARENTMARKER.ID,
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
              marker.destroyMarkerAnimation(true);
              this.destroyMarker(marker, true);
            }
          },
          undefined,
          this,
        );
      });
    }
  }

  stopScene() {
    this.timeConsumed = true;
    this.sound.stopAll();
    this.scene.stop(Constants.SCENES.WorkoutCardio);
    this.scene.stop(Constants.SCENES.HUD);
    this.scene.start(Constants.SCENES.Menu);
  }

  destroyMarker(marker: any, touched: boolean): void {
    // this.currentMarkersAlive--;
    // this.exp = Number(this.registry.get(Constants.REGISTER.EXP));
    // if ((marker.getErrorMarker() && touched) || (!marker.getErrorMarker() && !touched)) {
    //   if (Number(this.registry.get(Constants.REGISTER.EXP)) > 0) {
    //     this.exp = this.exp - 10;
    //   }
    // } else if ((marker.getErrorMarker() && !touched) || (!marker.getErrorMarker() && touched)) {
    //   this.exp = this.exp + 10;
    // }
    // this.registry.set(Constants.REGISTER.EXP, this.exp);
    // this.events.emit(Constants.EVENT.UPDATEEXP);

    // // Update variables for next markers
    // this.randomMarker = Math.floor(Math.random() * (24 - 1 + 1)) + 1;
    // if (this.currentMarkersAlive == 0) {
    //   this.currentLevel = Number(this.registry.get(Constants.REGISTER.LEVEL))
    //   this.probabilityTypesMarkers(0.15, this.currentLevel / 10);
    //   if (this.multipleMarkerProb && this.currentLevel > 5) {
    //     this.maxMarkers = 3;
    //   } else if (this.multipleMarkerProb) {
    //     this.maxMarkers = 2;
    //   } else {
    //     this.maxMarkers = 1;
    //   }

    // }
  }

  update(time: number, delta: number): void {
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

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }

}
