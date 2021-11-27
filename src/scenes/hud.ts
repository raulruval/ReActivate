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
    const workoutCardio: Phaser.Scene = this.scene.get(Constants.SCENES.WorkoutCardio);
    const workoutAgilidad: Phaser.Scene = this.scene.get(Constants.SCENES.WorkoutAgilidad);
    const WorkoutFlexibilidad: Phaser.Scene = this.scene.get(Constants.SCENES.WorkoutFlexibilidad);

    if (workoutCardio) {
      workoutCardio.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
      workoutCardio.events.on(Constants.EVENT.CLOCK, this.updateClock, this);
    }
    if (workoutAgilidad) {
      workoutAgilidad.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
      workoutAgilidad.events.on(Constants.EVENT.CLOCK, this.updateClock, this);
    }
    if (WorkoutFlexibilidad) {
      WorkoutFlexibilidad.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
      WorkoutFlexibilidad.events.on(Constants.EVENT.CLOCK, this.updateClock, this);
    }

    this.hudImage = this.add.image(this.width / 3, 50, 'hud');
    this.hudImage.setScale(0.9, 0.85);

    this.expTxt = this.add.text(76, 27, '1', {
      fontFamily: 'Russo One',
      fontSize: '45px',
      color: '#FFFFFF',
      fontStyle: 'normal',
    });
    this.clockTxt = this.add.text(this.width / 2 + 30, 27, '00:00', {
      fontFamily: 'Russo One',
      fontSize: '43px',
      color: '#FFFFFF',
      fontStyle: 'normal',
    });
    this.expBarGraphic = this.add.graphics();
  }

  private updateExp(): void {
    if (parseInt(this.expTxt.text) > 9) {
      this.expTxt.x = 63;
    }
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
    const width = 450;
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
    if (percent >= 0) {
      this.expBarGraphic.clear();
      this.expBarGraphic.fillStyle(0x00ff00, 0.8);
      this.expBarGraphic.fillRect(125, 46, width * percent, 11.5);
    }
    if (Number(this.registry.get(Constants.REGISTER.EXP)) >= 100) {
      this.level = this.level + 1;
      this.registry.set(Constants.REGISTER.EXP, 0);
      this.events.emit(Constants.EVENT.UPDATEEXP);
      this.lastExp = 0;
      this.registry.set(Constants.REGISTER.LEVEL, this.level);
      this.expTxt.text = this.level.toString();
      this.updateExp();
    }
  }

  private updateClock(): void {
    this.clockTxt.text = this.registry.get(Constants.REGISTER.CLOCK);
  }
}
