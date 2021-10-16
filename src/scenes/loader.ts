import Constants from '~/constants';
import WebFontFile from '~/WebFontFile';

export default class Loader extends Phaser.Scene {
  private loadBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private textLoading: Phaser.GameObjects.Text;
  private width: number;
  private height: number;

  constructor() {
    super(Constants.SCENES.LOADER);
  }

  preload(): void {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
    this.load.path = 'assets/';
    this.cameras.main.setBackgroundColor(0x000000);
    this.buildBar();

    const fonts = new WebFontFile(this.load, 'Russo One');
    this.load.addFile(fonts);

    this.textLoading = this.add.text(this.width / 2 - 120, this.height / 2 - 120, 'Cargando ...', {
      fontFamily: 'Russo One',
      fontSize: '45px',
      color: '#FFFFFF',
      fontStyle: 'normal',
    });

    //Listener mientras se cargan los assets
    this.load.on(
      'progress',
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x125555, 1);
        this.progressBar.fillRect(
          this.width / 4,
          this.height / 2 - 16,
          (this.width / 2) * value,
          16,
        );
      },
      this,
    );
    this.load.on(
      'complete',
      () => {
        this.scene.start(Constants.SCENES.Menu);
        // this.scene.start(Constants.SCENES.WorkoutCardio);
        // this.scene.start(Constants.SCENES.HUD);
        // this.scene.bringToTop(Constants.SCENES.HUD);
      },
      this,
    );

    this.load.image('point', 'img/point.png');
    this.load.image('hud', 'img/hud.png');
    this.load.image('out', 'img/out.png');
    this.load.image('silhouette', 'img/blueSilhouette.png');
    this.load.image('button', 'img/button.png');
    this.load.image('getReady', 'img/getReady.png');
    this.load.image('ball', 'sprites/blueBall.png');
    this.load.image('errorBall', 'sprites/redBall.png');
    this.load.image('marker', 'img/marker.png');

    // MUSIC & EFFECTS
    this.load.audio('trance', 'audio/trance.mp3');
    this.load.audio('sfxDestroyMarkerTouched', 'audio/soundAnimation.wav');
    this.load.audio('sfxDestroyMarkerUntouched', 'audio/sfxDestroyMarkerUntouched.wav');

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
      this.width / 4 - 2,
      this.height / 2 - 18,
      this.width / 2 + 4,
      20,
    );
    this.progressBar = this.add.graphics();
  }
}
