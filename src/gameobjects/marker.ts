import Phaser from 'phaser';
import Constants from '~/constants';

export default class Marker extends Phaser.Physics.Arcade.Sprite {
  private ball: Phaser.GameObjects.Sprite;
  private tween!: Phaser.Tweens.Tween;
  private id: number;
  scene: Phaser.Scene;
  private coordx: number;
  private coordy: number;
  private animationCreated: boolean;
  private errorMarker: boolean = false;
  private internalTimerConsumed: boolean = false;
  private timerEvent;
  private defaultMarker: string = "blueBall";
  private defaultErrorMarker: string = "errorBall";
  private flexibilityGame: boolean;
  private agilityGame: boolean;
  private directionAngle: number = 0;
  private flagChangeAngle = false;


  constructor(config: any) {
    super(config.scene, config.x, config.y, config.texture, config.id);
    this.scene = config.scene;
    this.coordx = config.x;
    this.coordy = config.y;
    this.id = config.id;
    this.animationCreated = false;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  update(): void {
    if (this.animationCreated && !this.flexibilityGame) {
      this.ball.angle += 0.5;
      if (this.agilityGame) {
        this.ball.scale -= 0.0001;
      } else {
        this.ball.scale -= 0.0002;
      }
    } else if (this.animationCreated && this.flexibilityGame) {
      this.ball.scale -= 0.000025;
      if (this.flagChangeAngle) {
        this.ball.rotation = this.directionAngle;
        this.flagChangeAngle = false;
      }
    }
  }

  public destroyMarkerAnimation(touched: boolean): void {
    if (touched && !this.errorMarker || !touched && this.errorMarker) {
      this.scene.sound.play(Constants.AUDIO.DESTROYTOUCHED, { volume: 0.85 });
    } else {
      this.scene.sound.play(Constants.AUDIO.DESTROYUNTOUCHED, { volume: 0.5 });
    }
    this.timerEvent.remove(false);
    // this.group.destroy(true, true);
    this.ball.destroy();
    this.internalTimerConsumed = false;
    this.animationCreated = false;
  }

  createAnimation(currentLevel: number): void {

    if (this.errorMarker) {
      this.ball = this.scene.add.sprite(this.coordx, this.coordy, this.defaultErrorMarker);
    } else {
      this.ball = this.scene.add.sprite(this.coordx, this.coordy, this.defaultMarker);
    }
    if (this.flexibilityGame) {
      this.ball.setScale(0.10);
    } else {
      this.ball.setScale(0.11);
    }

    let timerForMarker = 5500;
    if (this.flexibilityGame) timerForMarker = 20000;
    if (this.agilityGame) timerForMarker = 9000;
    if (currentLevel < 10) {
      timerForMarker = timerForMarker - (currentLevel * 100);
    }
    // Internal timer
    this.timerEvent = this.scene.time.addEvent({
      delay: timerForMarker, callback: () => {
        this.internalTimerConsumed = true;
      }, callbackScope: this
    });

    this.animationCreated = true;
  }

  setDefaultBall(ball: string, errorBall: string) {
    this.defaultMarker = ball;
    this.defaultErrorMarker = errorBall;
    this.flexibilityGame = true;
  }

  getAnimationCreated(): boolean {
    return this.animationCreated;
  }

  setAnimationCreated(value: boolean): void {
    this.animationCreated = value;
  }

  setErrorMarker(errorMaker: boolean): void {
    this.errorMarker = errorMaker;
    if (this.animationCreated) {
      if (this.errorMarker) {
        this.ball.setTexture(this.defaultErrorMarker);
      } else {
        this.ball.setTexture(this.defaultMarker);
      }
    }
  }

  setDirectionAngle(angle: number) {
    this.directionAngle = angle;
    this.flagChangeAngle = true;
  }

  getErrorMarker(): boolean {
    return this.errorMarker;
  }

  setAgilityGame(agility: boolean) {
    this.agilityGame = agility;
  }

  isInternalTimerConsumed(): boolean {
    return this.internalTimerConsumed;
  }
}
