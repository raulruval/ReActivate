import Phaser from 'phaser';
import Constants from '~/constants';
import CustomButtom from '~/gameobjects/custom-button';
import Marker from '~/gameobjects/marker';
import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';
import StatsData from '~/statsData';
import Utils from '~/utils';
import Menu from './menu';

export default class WorkoutAgility extends AbstractPoseTrackerScene {

  private markers: any[] = [];
  private bodyPoints: Phaser.Physics.Arcade.Sprite[] = [];
  private exp: number = 0;
  private levelTime: number;
  private remainingTime: number;
  private audioScene: Phaser.Sound.BaseSound;
  private audioContactError: Phaser.Sound.BaseSound;
  private workoutStarted: boolean = false;
  private silhouetteImage: Phaser.GameObjects.Image;
  private buttonsReady: any[] = [];
  private buttonReadyLeft;
  private buttonReadyRight;
  private getReadyLeft: boolean = false;
  private getReadyRight: boolean = false;
  private buttonExitMarker;
  private currentMarkersAlive: number = 0;
  private randomMarker: number = 3;
  private currentLevel: number;
  private maxMarkers: number = 1; // Se empieza con al menos 1 marcador
  private multipleMarkerProb = false;
  private triggerAction: boolean = true;
  private touchingButton: boolean = false;
  private ball;
  private particles;
  private ballEmitter;
  private ballAppearanceLeft: boolean = true;
  private ballAppearanceTop: boolean = true;
  private width: number;
  private height: number;
  private touchedMarkers: number = 0;
  private untouchedMarkers: number = 0;
  private totalTouchableMarkers: number = 0;
  private lastIdMarker = 0;

  constructor() {
    super(Constants.SCENES.WorkoutAgilidad);
  }


  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  create(): void {
    super.create();

    /************** Buttons Init *********/
    this.buttonExitMarker = new CustomButtom(this, 1200, 52, 'out', '[➔', 95, -48);
    this.buttonExitMarker.setScale(0.9, 0.85);
    this.buttonsReady.push(this.buttonExitMarker);

    this.buttonReadyLeft = new CustomButtom(this, 340, 230, 'getReady', 'I', 95, -48);
    this.buttonReadyLeft.setScale(0.9, 0.85);
    this.buttonsReady.push(this.buttonReadyLeft);

    this.buttonReadyRight = new CustomButtom(this, 940, 230, 'getReady', 'D', 95, -48);
    this.buttonReadyRight.setScale(0.9, 0.85);
    this.buttonsReady.push(this.buttonReadyRight);

    this.buttonsReady.forEach((button) => {
      this.add.existing(button);
      this.physics.world.enable(button);
      button.body.setAllowGravity(false);
    });
    this.silhouetteImage = this.add.image(640, 420, 'silhouette');
    this.silhouetteImage.setScale(0.7, 0.65);
    // body points
    for (var i = 0; i < 35; i++) {
      let point = this.physics.add.sprite(-20, -20, 'point');
      this.add.existing(point);
      point.setAlpha(0);
      this.bodyPoints.push(point);
    }

    /*****************************************/

    this.audioScene = this.sound.add(Constants.AUDIO.TRANCE2, { volume: 0.65, loop: false });
    this.audioContactError = this.sound.add(Constants.AUDIO.CONTACTERROR, { loop: false });

    /************** Get ready markers ******** */
    this.buttonsReady.forEach((button) => {

      this.bodyPoints.forEach((point) => {
        this.physics.add.overlap(
          button,
          point,
          () => {
            button.animateToFill(false);
            this.touchingButton = true;
            if (button.buttonIsFull() && button.isEnabled()) {
              button.emit('down', button);
            }
          },
          undefined,
          this,
        );
      });

      if (button) {
        button.setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            button.animateToFill(true);
          })
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            button.animateToEmpty(true);
          })
          .on('down', () => {
            button.animateToFill(true);
            this.touchingButton = true;
            if (button.buttonIsFull() && button.isEnabled()) {
              this.menuSwitch(button);
            }
          })
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            button.animateToFill(true);
            this.touchingButton = true;
            if (button.buttonIsFull() && button.isEnabled()) {
              this.menuSwitch(button);
            }
          });
      }

      if (this.scene.get(Constants.SCENES.Menu))
        this.scene.remove(Constants.SCENES.Menu);

    });
    /***************************************** */

    /************** Time control ************** */
    this.levelTime = 1;
    this.remainingTime = 9 * 60 + 50;
    this.registry.set(Constants.REGISTER.EXP, this.exp);
    /***************************************** */

  }

  menuSwitch(button: CustomButtom) {
    switch (button.getText()) {
      case '[➔':
        this.stopScene();
        break;
      case 'I':
        this.getReadyLeft = true;
        break;
      case 'D':
        this.getReadyRight = true;
        break;
      default:
        break;

    }
    if (this.getReadyLeft && this.getReadyRight) {
      this.startWorkout();
      this.events.emit(Constants.EVENT.STOPAUDIOINIT);
    }
  }

  startWorkout() {
    this.createLayout();
    this.createContactBall();

    this.workoutStarted = true;
    this.silhouetteImage.destroy();
    this.buttonsReady.forEach((button) => {
      if (button.getText() != '[➔')
        button.destroy();
    });
    this.audioScene.play();
    this.getReadyLeft = false;
    this.getReadyRight = false;
    this.sound.pauseOnBlur = false;
  }

  createContactBall() {
    this.particles = this.add.particles('particle-orange');
    this.ballEmitter = this.particles.createEmitter({
      speed: 80,
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      tint: ['0xfff107']
    });

    this.ball = this.physics.add.image(this.ballAppearanceLeft ? 0 : this.width, this.ballAppearanceTop ? 100 : this.height, 'meteorite');
    this.ball.setScale(0.15);
    this.ball.setAlpha(0.75);

    this.ballAppearanceLeft = !this.ballAppearanceLeft;
    if (Math.random() < 0.5) {
      this.ballAppearanceTop = !this.ballAppearanceTop;
    }

    this.ball.setVelocity(100, 200);
    this.ball.setBounce(1, 1);
    this.ball.setCollideWorldBounds(true);
    this.ball.setRotation(360);
    this.ballEmitter.startFollow(this.ball);
    this.bodyPoints.forEach((point) => {
      this.physics.add.overlap(
        this.ball,
        point,
        (_) => {
          this.bodyContactBall();
        },
        undefined,
        this,
      );
    });
  }

  bodyContactBall() {
    this.exp = Number(this.registry.get(Constants.REGISTER.EXP));
    if (Number(this.registry.get(Constants.REGISTER.EXP)) > 0) {
      this.exp = this.exp - 1;
    }
    this.ballEmitter.tint.onChange(0xff0000);
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.ballEmitter.tint.onChange(0xfff107);
      },
      loop: true
    })
    this.registry.set(Constants.REGISTER.EXP, this.exp);
    this.events.emit(Constants.EVENT.UPDATEEXP);
    if (!this.audioContactError.isPlaying) {
      this.audioContactError.play();
    }
  }

  movePoints(coords: IPoseLandmark[] | undefined) {
    if (this.bodyPoints && coords) {
      for (var i = 0; i < this.bodyPoints.length; i++) {
        if (i == 34) { // To extend hands points (improve accuracy)
          this.bodyPoints[i]?.setPosition(coords[19]?.x * 1280 + 20, coords[19]?.y * 720 - 40);
        } else if (i == 35) {
          this.bodyPoints[i]?.setPosition(coords[20]?.x * 1280 - 20, coords[20]?.y * 720 - 40);
        } else {
          this.bodyPoints[i]?.setPosition(coords[i]?.x * 1280, coords[i]?.y * 720);
        }
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
      marker.setAgilityGame(true);
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
    this.saveData();
    this.audioScene.stop();
    this.scene.stop();
    if (!this.scene.get(Constants.SCENES.Menu))
      this.scene.add(Constants.SCENES.Menu, Menu, false, { x: 400, y: 300 });
    this.scene.start(Constants.SCENES.Menu);
  }

  destroyMarker(marker: any, touched: boolean): void {
    this.currentMarkersAlive--;
    this.exp = Number(this.registry.get(Constants.REGISTER.EXP));
    if (!touched) {
      if (Number(this.registry.get(Constants.REGISTER.EXP)) > 0) {
        this.exp = this.exp - 10;
        if (!marker.getErrorMarker() && !touched) this.untouchedMarkers = this.untouchedMarkers + 1;
      }
    } else if (touched) {
      this.exp = this.exp + 10;
      if (!marker.getErrorMarker() && touched) this.touchedMarkers = this.touchedMarkers + 1;
    }

    this.randomMarker = Math.floor(Math.random() * (24 - 1 + 1)) + 1;
    while (this.randomMarker === this.lastIdMarker) {
      this.randomMarker = Math.floor(Math.random() * (24 - 1 + 1)) + 1;
    }
    this.lastIdMarker = this.randomMarker;
    if (this.exp >= 100) {
      this.time.addEvent({
        delay: 600,                // ms
        callback: () => {
          this.ball.destroy();
          this.ballEmitter.manager.destroy()
          this.createContactBall();
        }
      });
    }

    this.registry.set(Constants.REGISTER.EXP, this.exp);
    this.events.emit(Constants.EVENT.UPDATEEXP);

    if (this.currentMarkersAlive == 0) {
      if (this.multipleMarkerProb) {
        this.maxMarkers = 2;
      } else {
        this.maxMarkers = 1;
      }
    }

  }

  saveData() {
    var date: string = Utils.getActualDate();
    var statsData = new StatsData("agilidad", date, this.currentLevel, this.touchedMarkers, this.untouchedMarkers, this.totalTouchableMarkers);
    Utils.setLocalStorageData(statsData);
  }

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
        // This function will be called before refreshing the canvas texture.
        // Anything you add to the canvas texture will be rendered.
      },
      afterPaint: (poseTrackerResults) => {
        // This function will be called after refreshing the canvas texture.
      },
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
            marker.createAnimation();
            this.currentMarkersAlive++;
            this.randomMarker = Math.floor(Math.random() * (24 - 1 + 1)) + 1;
            this.totalTouchableMarkers++;
          }
        }
        if (marker.isInternalTimerConsumed() && marker.getAnimationCreated()) {
          marker.destroyMarkerAnimation(false);
          this.destroyMarker(marker, false);
        }
      });

      this.triggerAction = false;
      if (this.currentMarkersAlive == 0) {
        this.triggerAction = true;
      }

      this.ball.angle += 0.7;


      // Time Management
      if (this.levelTime != Math.floor(Math.abs(time / 1000))) {
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
