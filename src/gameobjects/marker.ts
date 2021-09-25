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
  private internalClockFps: number = 100;
  

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
      this.internalClockFps--;
    }
  }

  public destroyMarkerAnimation(touched: boolean): void {
    if (touched && !this.errorMarker || !touched && this.errorMarker) {
      this.scene.sound.play(Constants.MUSIC.DESTROYTOUCHED);
    } else {
      this.scene.sound.play(Constants.MUSIC.DESTROYUNTOUCHED);
    }
    this.group.destroy(true, true);
    this.animationCreated = false;
  }

  createAnimation(): void {
    const circle = new Phaser.Geom.Circle(this.coordx, this.coordy, 40);
    this.internalClockFps = 120
    this.group = this.scene.add.group();
    if (this.errorMarker) {
      this.group.createMultiple({ key: 'errorBall', frameQuantity: 15 });
    } else {
      this.group.createMultiple({ key: 'ball', frameQuantity: 15 });
    }
    Phaser.Actions.PlaceOnCircle(this.group.getChildren(), circle);

    /// Marker animation
    this.tween = this.scene.tweens.addCounter({
      from: 40,
      to: 30,
      duration: 2000,
      delay: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    this.animationCreated = true;
  }

  playAnimation(): void {
    Phaser.Actions.RotateAroundDistance(
      this.group.getChildren(),
      { x: this.coordx, y: this.coordy },
      0.02,
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

  getInternalClockFps(): boolean {
    return this.internalClockFps == 0 ? true : false;
  }

  setInternalClockFps(seconds: number): void {
    this.internalClockFps = seconds;
  }
}
