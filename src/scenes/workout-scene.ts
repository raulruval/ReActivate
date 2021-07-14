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
    this.load.image('rec', 'assets/img/rec.png');

    this.load.image('load1', 'assets/img/load1.png');
    this.load.image('load2', 'assets/img/load2.png');
    this.load.image('load3', 'assets/img/load3.png');
  }

  private buttonTutorial;
  private handPalm;

  create(): void {
    super.create();
    this.buttonTutorial = new CustomBottom(this, 200, 200, 200, 'button', 'buttonSelected', 'Tutorial')
      .withLeftCap(this.add.image(0, 0, 'load1'))
      .withMiddleCap(this.add.image(0, 0, 'load2'))
      .withRightCap(this.add.image(0, 0, 'load3'))
      .layout();

    this.add.existing(this.buttonTutorial);

    // this.buttonTutorial.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
    //   console.log('buttom tutorial');
    // });
    this.handPalm = this.physics.add.sprite(500, 500, 'rec');
    this.add.existing(this.handPalm);
    this.physics.world.enable(this.buttonTutorial);
    this.buttonTutorial.body.setAllowGravity(false);
    this.buttonTutorial.body.moves = false;
  }

  makeSelection() {
    const fullButton = this.buttonTutorial.progressBar();

    if (fullButton) {
    console.log('Iniciar');
    this.buttonTutorial.animateToFill(0.5,500);
    }
    
  }

  updateHand(coords) {
    if (this.handPalm && coords) {
      //console.log('actualiza coords' + coords.x * 1000 + ' y ' + coords.y * 1000);
      this.physics.moveTo(this.handPalm, coords.x * 1280, coords.y * 720, 800);
    }
  }

  update(time: number, delta: number): void {
    this.physics.add.overlap(this.buttonTutorial, this.handPalm, this.makeSelection, undefined, this);
    //this.physics.collide(this.handPalm,this.buttonTutorial,this.makeSelection());

    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: true,
        shouldDrawPoseLandmarks: true,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        
        // This function will be called before refreshing the canvas texture.
        // Anything you add to the canvas texture will be rendered.
      },
      afterPaint: (poseTrackerResults) => {
        this.updateHand(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks[20] : undefined);

        // This function will be called after refreshing the canvas texture.
      },
    });

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
