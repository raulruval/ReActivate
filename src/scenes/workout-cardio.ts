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
  private randomMarker: number = 3;
  private buttonExitMarker;
  private touchingButton: boolean = false;
  /* multipleMarker y errorMarker son asignadas cada vez que es necesario crear marcadores nuevos teniendo en cuenta la probabilidad en el nivel */
  private multipleMarkerProb = false;
  private errorMakerProb = false;
  private currentMarkersAlive: number = 0;
  private maxMarkers: number = 1; // Se empieza con al menos 1 marcador

  constructor() {
    super(Constants.SCENES.WorkoutCardio);
  }

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
    this.remainingTime = 125;
    this.timeConsumed = false;
    this.registry.set(Constants.REGISTER.EXP, this.exp);
    /***************************************** */
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
    this.currentMarkersAlive--;
    if ((marker.getErrorMarker() && touched) || (!marker.getErrorMarker() && !touched)) {
      if (Number(this.registry.get(Constants.REGISTER.EXP)) > 0) {
        this.exp = Number(this.registry.get(Constants.REGISTER.EXP)) - 10;
      }
    } else if ((marker.getErrorMarker() && !touched) || (!marker.getErrorMarker() && touched)) {
      this.exp = Number(this.registry.get(Constants.REGISTER.EXP)) + 10;
    }
    this.registry.set(Constants.REGISTER.EXP, this.exp);
    this.events.emit(Constants.EVENT.UPDATEEXP);
    this.randomMarker = Math.floor(Math.random() * (24 - 1 + 1)) + 1;
    if (this.currentMarkersAlive == 0) {
      let currentLevel = Number(this.registry.get(Constants.REGISTER.LEVEL))
      this.probabilityTypesMarkers(0.25, currentLevel/10 );
      if (this.multipleMarkerProb && currentLevel > 5){
        this.maxMarkers = 3;
      }else if (this.multipleMarkerProb){
        this.maxMarkers = 2;
      }else{
        this.maxMarkers = 1;
      }
    }
  }

  probabilityTypesMarkers(probError: number, probMultiple: number) {
    let rand = Math.random();
    rand < probError ? (this.errorMakerProb = true) : (this.multipleMarkerProb = false);
    rand < probMultiple ? (this.multipleMarkerProb = true) : (this.multipleMarkerProb = false);
  }

  /* ***************************************************************************** */
  update(time: number, delta: number): void {
    if (!this.touchingButton) {
      this.bodyPoints.forEach((point) => {
        if (point.body && point.body.touching.none) {
          this.buttonExitMarker.animateToEmpty(false);
        }
      });
    }
    this.touchingButton = false;
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
    /****************************************************************************** */
    if (this.workoutStarted) {
      this.markers.forEach((marker) => {
        if (marker.getAnimationCreated()) {
          // Si tiene animación actualizala.
          marker.update();
        }

        /* Lógica para crear los marcadores */
        if (marker.id == this.randomMarker) {
          if (!marker.getAnimationCreated() && this.triggerAction && this.currentMarkersAlive < this.maxMarkers) {
            marker.setErrorMarker(this.errorMakerProb);
            if (this.errorMakerProb) {
              this.errorMakerProb = false;
            }
            marker.createAnimation();
            this.currentMarkersAlive++;
            this.randomMarker = Math.floor(Math.random() * (24 - 1 + 1)) + 1;
          }
        }
        if (marker.getInternalClockFps() && marker.getAnimationCreated()) {
          marker.destroyMarkerAnimation(false);
          this.destroyMarker(marker, false);
        }
      });

      this.triggerAction = false;
      if (this.currentMarkersAlive == 0) {
        this.triggerAction = true;
      }

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
          this.stopScene();
        }
      }
    }
  }
}
