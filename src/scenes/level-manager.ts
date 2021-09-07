import Constants from '~/constants';

export default class LevelManager extends Phaser.Scene {
  protected levelName: string;
  public exp: number;

  //time level
  protected levelTime: number;
  protected remainingTime: number;
  protected timeConsumed: boolean;

  constructor(level: string) {
    super(level);
    this.levelName = level;
  }

  /**
   * Inicialización de la escena
   */
  init(): void {
    this.exp = 0;

    this.levelTime = 1;
    this.remainingTime = 15;
    this.timeConsumed = false;

    this.registry.set(Constants.REGISTER.EXP, this.exp);
  }

  /**
   * Vuelve a Menu haciendo un fadeout de la cámara
   * parando música, y las dos escenas HUD y la del Nivel
   */
   returnMenu(): void {
      this.sound.stopAll();
      this.scene.stop(this.levelName);
      this.scene.stop(Constants.SCENES.HUD);
      this.scene.start(Constants.SCENES.Menu);
  }

}
