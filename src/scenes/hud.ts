import Constants from '~/constants';

export default class HUD extends Phaser.Scene {
  private expTxt: Phaser.GameObjects.Text;
  private clockTxt: Phaser.GameObjects.Text;

  private width: number;
  private height: number;

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

    this.expTxt = this.add.text(20, 20, 'Experiencia', { fontSize: '32px', color: '#FFFFFF' });
    this.clockTxt = this.add.text(this.width / 2, 20, '10:00', { fontSize: '20px', color: '#FFFFFF' });
  }

  private updateExp(): void {
    this.expTxt.text = 'Experiencia: ' + this.registry.get(Constants.REGISTER.EXP);
  }

  private updateClock(): void {
    this.clockTxt.text = this.registry.get(Constants.REGISTER.CLOCK);
  }
}
