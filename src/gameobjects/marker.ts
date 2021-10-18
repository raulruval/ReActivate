import Phaser from 'phaser';
import Constants from '~/constants';

export default class Marker extends Phaser.Physics.Arcade.Sprite {
  private group!: Phaser.GameObjects.Group;
  private tween!: Phaser.Tweens.Tween;
  private id: number;
  scene: Phaser.Scene;
  private coordx: number;
  private coordy: number;
  private animationCreated: boolean;
  private errorMarker: boolean = false;
  private internalTimerConsumed: boolean = false;
  private timerEvent;


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
    if (this.animationCreated) {
      this.playAnimation();
    }
  }

  public destroyMarkerAnimation(touched: boolean): void {
    if (touched && !this.errorMarker || !touched && this.errorMarker) {
      this.scene.sound.play(Constants.MUSIC.DESTROYTOUCHED);
    } else {
      this.scene.sound.play(Constants.MUSIC.DESTROYUNTOUCHED);
    }
    this.timerEvent.remove(false);
    this.group.destroy(true, true);
    this.internalTimerConsumed = false;
    this.animationCreated = false;
  }

  createAnimation(currentLevel: number): void {
    const circle = new Phaser.Geom.Circle(this.coordx, this.coordy, 30);

    this.group = this.scene.add.group();
    if (this.errorMarker) {
      this.group.createMultiple({ key: 'errorBall', frameQuantity: 15 });
    } else {
      this.group.createMultiple({ key: 'ball', frameQuantity: 15 });
    }
    Phaser.Actions.PlaceOnCircle(this.group.getChildren(), circle);

    /// Marker animation
    this.tween = this.scene.tweens.addCounter({
      from: 30,
      to: 0,
      duration: 4500,
      delay: 700,
      ease: 'Expo.easeIn',
      repeat: -1,
      yoyo: true,
    });
    let timerForMarker = 5500;
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

  playAnimation(): void {
    Phaser.Actions.RotateAroundDistance(
      this.group.getChildren(),
      { x: this.coordx, y: this.coordy },
      0.005,
      this.tween.getValue(),
    );
  }

  getAnimationCreated(): boolean {
    return this.animationCreated;
  }

  setAnimationCreated(value: boolean): void {
    this.animationCreated = value;
  }

  setErrorMarker(errorMaker: boolean): void {
    this.errorMarker = errorMaker;
  }

  getErrorMarker(): boolean {
    return this.errorMarker;
  }

  isInternalTimerConsumed(): boolean {
    return this.internalTimerConsumed;
  }
}
