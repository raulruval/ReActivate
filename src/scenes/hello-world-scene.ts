import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world-scene');
  }

  preload(): void {
    this.load.image('logo', 'assets/img/koala.png');
    this.load.image('particle-red', 'assets/img/particle-red.png');
  }

  create(): void {
    const particles = this.add.particles('particle-red');

    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
    });

    const logo = this.physics.add.image(400, 100, 'logo');
    logo.setScale(0.5, 0.5);

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

    this.input.once('pointerdown', (event: unknown) => {
      this.scene.start('workout-scene');
    });
  }
}
