import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import CustomButtom from '~/gameobjects/custom-button';
import Constants from '~/constants';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';
import Utils from '~/utils';
import Stats from '../modals/stats';
import WorkoutCardio from './workout-cardio';
import HUD from './hud';
import WorkoutAgility from './workout-agilidad';
import Historical from '~/modals/historical';

export default class Menu extends AbstractPoseTrackerScene {
  constructor() {
    super(Constants.SCENES.Menu);
  }

  private flexibility;
  private cardio;
  private agility;
  private tutorial;
  private buttonRanking;
  private buttonStats;
  private buttonRight;
  private buttonLeft;
  private buttonExitMarker;
  private background;
  private buttonNextHistorical;
  private buttonPreviousHistorical;
  private width: number;
  private height: number;
  private statsView: Stats;
  private historicalView: Historical;
  private titleText: Phaser.GameObjects.Text;
  private statsOn;

  private bodyPoints: any = [];
  private buttons: any[] = [];
  private touchingButton: boolean = false;

  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  create(): void {


    super.create();

    this.titleText = this.add.text(this.width / 2 - 120, this.height / 12, 'ReActívate', {
      fontFamily: 'Russo One',
      fontSize: '45px',
      color: '#FFFFFF',
      fontStyle: 'normal',
    });
    this.titleText.depth = 1;
    this.titleText.setVisible(false); // Quitar después de demo

    this.background = this.add.image(1280, 720 / 2, "room");

    this.flexibility = new CustomButtom(this, 250, 220, 'button', 'Flexibilidad');
    this.buttons.push(this.flexibility);

    this.cardio = new CustomButtom(this, 645, 220, 'button', 'Cardio');
    this.buttons.push(this.cardio);

    this.agility = new CustomButtom(this, 1042, 220, 'button', 'Agilidad');
    this.buttons.push(this.agility);

    this.buttonRight = new CustomButtom(this, 1220, 600, 'out', '►', 95, -48);
    this.buttons.push(this.buttonRight);

    this.buttonLeft = new CustomButtom(this, 60, 600, 'out', '◄', 95, -48);
    this.buttonLeft.setVisible(false);
    this.buttons.push(this.buttonLeft);

    
    this.buttonPreviousHistorical = new CustomButtom(this, 80, this.height / 2, 'out', '＜', 95, -48);
    this.buttonPreviousHistorical.setVisible(false);
    this.buttonPreviousHistorical.setEnabled(false);
    this.buttons.push(this.buttonPreviousHistorical);

    this.buttonNextHistorical = new CustomButtom(this, 1200, this.height / 2, 'out', '＞', 95, -48);
    this.buttonNextHistorical.setVisible(false);
    this.buttonNextHistorical.setEnabled(false);
    this.buttons.push(this.buttonNextHistorical);


    this.tutorial = new CustomButtom(this, 250, 220, 'button', 'Tutorial')
    this.tutorial.setVisible(false);
    this.tutorial.setEnabled(false);
    this.buttons.push(this.tutorial);

    this.buttonRanking = new CustomButtom(this, 645, 220, 'button', 'Historial')
    this.buttonRanking.setVisible(false);
    this.buttonRanking.setEnabled(false);
    this.buttons.push(this.buttonRanking);

    this.buttonStats = new CustomButtom(this, 1042, 220, 'button', 'Estadísticas')
    this.buttonStats.setVisible(false);
    this.buttonStats.setEnabled(false);
    this.buttons.push(this.buttonStats);

    this.buttonExitMarker = new CustomButtom(this, 1200, 52, 'out', 'X', 95, -48);
    this.buttonExitMarker.setVisible(false);
    this.buttonExitMarker.setEnabled(false);
    this.buttons.push(this.buttonExitMarker);


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

    // this.time.addEvent({
    //   delay: 10000,
    //   callback: () => {
    //     this.menuSwitch(this.cardio)
    //   },
    //   loop: false
    // })

    this.buttons.forEach((button) => {

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

    });

    if (this.scene.get(Constants.SCENES.WorkoutCardio))
      this.scene.remove(Constants.SCENES.WorkoutCardio);
    if (this.scene.get(Constants.SCENES.WorkoutAgilidad))
      this.scene.remove(Constants.SCENES.WorkoutCardio);
    if (this.scene.get(Constants.SCENES.HUD))
      this.scene.remove(Constants.SCENES.HUD);
  }

  menuSwitch(button: CustomButtom) {
    switch (button.getText()) {
      case 'Flexibility':
        //this.startNewSceneWorkout(Constants.SCENES.WorkoutCardio, WorkoutCardio);
        break;
      case 'Cardio':
        this.startNewSceneWorkout(Constants.SCENES.WorkoutCardio, WorkoutCardio);
        break;
      case 'Agilidad':
        this.startNewSceneWorkout(Constants.SCENES.WorkoutAgilidad, WorkoutAgility);
        break;
      case 'Tutorial':
        break;
      case 'Estadísticas':
        this.statsView = new Stats(this, this.width / 2, this.height / 2, "backgroundStats");
        this.buttonLeft.setVisible(false);
        this.buttonLeft.setEnabled(false);
        this.setScreen2(false);
        this.titleText.setVisible(false);
        this.buttonExitMarker.setVisible(true);
        this.buttonExitMarker.setEnabled(true);

        this.statsOn = true;
        break;
      case 'Flexibilidad':

        break;
      case 'Historial':
        this.historicalView = new Historical(this, this.width / 2, this.height / 2, "backgroundStats");
        this.buttonLeft.setVisible(false);
        this.buttonLeft.setEnabled(false);
        this.setScreen2(false);
        this.titleText.setVisible(false);
        this.buttonExitMarker.setVisible(true);
        this.buttonExitMarker.setEnabled(true);
        this.buttonNextHistorical.setVisible(true);
        this.buttonNextHistorical.setEnabled(true);
        this.buttonPreviousHistorical.setVisible(true);
        this.buttonPreviousHistorical.setEnabled(true);

        break;
      case '►':
        if (button.isEnabled()) {
          this.tweens.add({
            targets: this.background,
            x: 0,
            duration: 3000,
            ease: 'Power2',
            completeDelay: 3000
          });

          this.buttonRight.setVisible(false);
          this.setScreen1(false);
          this.buttonLeft.setVisible(true);
          this.setScreen2(true);
        }

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
        if (button.isEnabled()) {
          this.tweens.add({
            targets: this.background,
            x: 1280,
            duration: 3000,
            ease: 'Power2',
            completeDelay: 3000
          });

          this.setScreen2(false);
          this.buttonLeft.setVisible(false);
          this.buttonRight.setVisible(true);
          this.setScreen1(true);
          break;
        }
      case 'X':
        this.buttonExitMarker.setVisible(false);
        this.buttonExitMarker.setEnabled(false);
        this.setScreen2(true);
        this.buttonLeft.setVisible(true);
        this.buttonLeft.setEnabled(true);
        this.buttonNextHistorical.setVisible(false);
        this.buttonPreviousHistorical.setVisible(false);
        this.buttonNextHistorical.setEnabled(false);
        this.buttonPreviousHistorical.setEnabled(false);
        if (this.historicalView)
          this.historicalView.destroyHistorical();
        if (this.statsView)
          this.statsView.destroyStats();
        this.statsOn = false;
        break;
      case '＞':
        this.historicalView.showHistorical(true);
        break;
      case '＜':
        this.historicalView.showHistorical(false);
        break;
      default:
        break;
    }
  }
  setScreen1(enable: boolean) {
    this.flexibility.setVisible(enable);
    this.cardio.setVisible(enable);
    this.agility.setVisible(enable);
    this.flexibility.setEnabled(enable);
    this.cardio.setEnabled(enable);
    this.agility.setEnabled(enable);
  }
  setScreen2(enable: boolean) {
    this.tutorial.setVisible(enable);
    this.buttonRanking.setVisible(enable);
    this.buttonStats.setVisible(enable);
    this.tutorial.setEnabled(enable);
    this.buttonRanking.setEnabled(enable);
    this.buttonStats.setEnabled(enable);
  }

  startNewSceneWorkout(scene: string, nameClass: Class) {
    this.scene.stop();
    if (!this.scene.get(scene))
      this.scene.add(scene, nameClass, false, { x: 400, y: 300 });
    if (!this.scene.get(Constants.SCENES.HUD))
      this.scene.add(Constants.SCENES.HUD, HUD, false, { x: 400, y: 300 });
    this.scene.start(scene);
    this.scene.start(Constants.SCENES.HUD);
    this.scene.bringToTop(Constants.SCENES.HUD);
  }

  movePoints(coords: IPoseLandmark[] | undefined) {
    if (this.bodyPoints && coords) {
      for (var i = 0; i < this.bodyPoints.length; i++) {
        this.bodyPoints[i].setPosition(coords[i + 11]?.x * 1280, coords[i + 11]?.y * 720);
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
    if (this.statsOn) {
      this.statsView.updateAnimationStats();
      this.statsView.updateAnimationCircle();
    }
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
        // This function will be called after refreshing the canvas texture.
        this.movePoints(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks : undefined);
      },
    });
    this.touchingButton = false;

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
