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
    if (this.animationCreated) this.playAnimation();
  }

  public destroyMarkerAnimation(): void {
    this.scene.sound.play('sfx');
    this.group.destroy(true,true);
    this.animationCreated = false;
  }

  createAnimation(): void {
    const circle = new Phaser.Geom.Circle(this.coordx, this.coordy, 40);

    this.group = this.scene.add.group();

    this.group.createMultiple({ key: 'ball', frameQuantity: 15 });
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
}
