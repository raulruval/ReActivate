import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import Phaser from 'phaser';
import CustomButtom from '~/objects/custom-button';
import Marker from '~/objects/marker';

export default class FirstWorkoutScene extends AbstractPoseTrackerScene {
  constructor() {
    super('first-workout-scene');
  }

  preload(): void {
    super.preload();
    this.load.image('marker', 'assets/img/marker.png');
    this.load.audio('trance', 'assets/audio/trance.mp3');
    this.load.audio('sfx', 'assets/audio/soundAnimation.wav');
  }

  private handPalm;
  private buttons: any[] = [];

  create(): void {
    super.create();
    this.sound.pauseOnBlur = false;
    const audio = this.sound.add('trance', { loop: true }) as Phaser.Sound.HTML5AudioSound
    audio.play();
    let width: number = 50;
    let height: number = 70;

    for (var i = 1; i < 26; i++) {
      this.buttons.push(new Marker(this, width, height, 'marker', i, 'sfx'));
      if (i % 6 == 0) {
        height = height + 200;
        width = 50;
      } else {
        if (i % 3 == 0) {
          width = width + 530;
        }
        width = width + 130; // 50 + 130 * 3 = 440
      }
    }

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
    this.buttons.forEach((button) => {
      button.animateMarker();
    });
    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
