import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import Phaser from 'phaser';
import Marker from '~/gameobjects/marker';
import Constants from '~/constants';

export default class WorkoutCardio extends AbstractPoseTrackerScene {
  private handPalm;
  private markers: any[] = [];
  private triggerAction: boolean = true;
  private exp: number;
  private levelTime: number;
  private remainingTime: number;
  private timeConsumed: boolean;

  constructor() {
    super(Constants.SCENES.WorkoutCardio);
  }

  preload(): void {
    super.preload();
  }

  create(): void {
    super.create();
    this.handPalm = this.physics.add.sprite(500, 500, 'rec');
    this.add.existing(this.handPalm);
    this.createLayout();

    this.sound.pauseOnBlur = false;
    const audio = this.sound.add(Constants.MUSIC.TRANCE, { loop: true }) as Phaser.Sound.HTML5AudioSound;
    audio.play();

    const testTxt: Phaser.GameObjects.Text = this.add
      .text(30, 50, 'test', { fontSize: '32px', color: '#FFFFFF' })
      .setInteractive();

    testTxt.on('pointerdown', () => {
      this.exp = 50;
      this.registry.set(Constants.REGISTER.EXP, this.exp);
      this.events.emit(Constants.EVENT.UPDATEEXP);
    });

    // Time control
    this.levelTime = 1;
    this.remainingTime = 10;
    this.timeConsumed = false;
  }

  moveHand(coords) {
    if (this.handPalm && coords) {
      this.physics.moveTo(this.handPalm, coords.x * 1280, coords.y * 720, 800);
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
      this.physics.add.overlap(
        marker,
        this.handPalm,
        (marker: any) => {
          if (marker.getAnimationCreated()) {
            marker.destroyMarkerAnimation();
          }
        },
        undefined,
        this,
      );
    }
  }

  update(time: number, delta: number): void {
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
      //Registro
      this.registry.set(Constants.REGISTER.CLOCK, clockText);
      //envío al HUD
      this.events.emit(Constants.EVENT.CLOCK);

      //Cuando el tiempo termine GAME OVER
      if (this.remainingTime == 0) {
        this.timeConsumed = true;
        this.scene.remove(Constants.SCENES.WorkoutCardio);
        this.scene.remove(Constants.SCENES.HUD);
        this.scene.start(Constants.SCENES.Menu);
      }
    }

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
