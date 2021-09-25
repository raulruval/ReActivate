import Constants from '~/constants';

export default class HUD extends Phaser.Scene {
  private expTxt: Phaser.GameObjects.Text;
  private clockTxt: Phaser.GameObjects.Text;
  private hudImage: Phaser.GameObjects.Image;
  private expBarGraphic: Phaser.GameObjects.Graphics;
  private lastExp;
  private width: number;
  private height: number;
  private level = 1;

  constructor() {
    super(Constants.SCENES.HUD);
  }

  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  create(): void {
    const workout: Phaser.Scene = this.scene.get(Constants.SCENES.WorkoutCardio);

    workout.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
    workout.events.on(Constants.EVENT.CLOCK, this.updateClock, this);
    this.hudImage = this.add.image(400, 37, 'hud');
    this.hudImage.setScale(0.9, 0.85);

    this.expTxt = this.add.text(44, 21, '0', { fontSize: '45px', color: '#FFFFFF' });
    this.clockTxt = this.add.text(this.width / 2 - 20, 23, '10:00', { fontSize: '45px', color: '#FFFFFF' });
    this.expBarGraphic = this.add.graphics();
  }

  private updateExp(): void {
    this.expTxt.text = this.level.toString();
    this.tweens.addCounter({
      from: this.lastExp,
      to: this.registry.get(Constants.REGISTER.EXP),
      duration: 200,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.setExpBar(value);
        this.lastExp = value;
      },
    });
  }

  private setExpBar(value: number) {
    const width = 493;
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
    if (percent >= 0) {
      this.expBarGraphic.clear();
      this.expBarGraphic.fillStyle(0x00ff00, 0.8);
      this.expBarGraphic.fillRect(91, 33.5, width * percent, 11.5);
    }
    if (value == 100) {
      this.level++;
      this.registry.set(Constants.REGISTER.LEVEL, this.level);
      this.registry.set(Constants.REGISTER.EXP, 0);
      this.events.emit(Constants.EVENT.UPDATEEXP);
      this.lastExp = 0;
    }
  }

  private updateClock(): void {
    this.clockTxt.text = this.registry.get(Constants.REGISTER.CLOCK);
  }
}
