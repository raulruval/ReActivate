import Constants from '~/constants';

export default class Loader extends Phaser.Scene {
  private loadBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super(Constants.SCENES.LOADER);
  }

  preload(): void {
    this.load.path = 'assets/';
    this.cameras.main.setBackgroundColor(0x000000);
    this.buildBar();

    //Listener mientras se cargan los assets
    this.load.on(
      'progress',
       (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x125555, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16,
        );
      },
      this,
    );
    this.load.on(
      'complete',
       () => {
        this.scene.start(Constants.SCENES.WorkoutCardio);
      },
      this,
    );

    this.load.image('point', 'img/point.png');
    this.load.image('silhouette', 'img/blueSilhouette.png');
    this.load.image('button', 'img/button.png');
    this.load.image('getReady', 'img/getReady.png');
    this.load.image('ball', 'sprites/shinyball.png');
    this.load.image('marker', 'img/marker.png');
    this.load.audio('trance', 'audio/trance.mp3');
    this.load.audio('sfx', 'audio/soundAnimation.wav');

    //Listener cuando se hayan cargado todos los Assets
    // this.load.on(
    //   'complete',
    //   () => {
    //     const fuenteJSON = this.cache.json.get(Constantes.FUENTES.JSON);
    //     this.cache.bitmapFont.add(Constantes.FUENTES.BITMAP, Phaser.GameObjects.RetroFont.Parse(this, fuenteJSON));

    //     //carga MENU
    //     this.scene.start(Constantes.ESCENAS.MENU);
    //   },
    //   this,
    // );
  }

  /**
   * For creating progress bars
   */
  private buildBar(): void {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0xffffff, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20,
    );
    this.progressBar = this.add.graphics();
  }
}
