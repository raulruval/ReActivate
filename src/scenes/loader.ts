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
      },
      this,

    );

    this.load.image('point', 'img/point.png');
    this.load.image('rightHand', 'img/rightHand.png');
    this.load.image('leftHand', 'img/leftHand.png');
    this.load.image('hud', 'img/hud.png');
    this.load.image('out', 'img/out.png');
    this.load.image('silhouette', 'img/blueSilhouette.png');
    this.load.image('button', 'img/button.png');
    this.load.image('getReady', 'img/out.png');
    this.load.image('blueBall', 'img/blueBall.png');
    this.load.image('errorBall', 'img/errorBall.png');
    this.load.image('marker', 'img/marker.png');
    this.load.image('transparentMarker', 'img/transparentMarker.png');
    this.load.image('backgroundStats', 'img/backgroundStats.png');
    this.load.image('room', 'img/room.png');
    this.load.image('meteorite', 'img/meteorite.png');
    this.load.image('particle-red', 'particles/particle-red.png');
    this.load.image('particle-orange', 'particles/particle-orange.png');
    this.load.image('particle-blue', 'particles/particle-blue.png');
    this.load.image('particle-green', 'particles/particle-green.png');
    this.load.image('triangle', 'img/triangle.png');
    this.load.image('redTriangle', 'img/redTriangle.png');

    this.load.bitmapFont('gothic', 'fonts/bitmap/gothic.png', 'fonts/bitmap/gothic.xml');

    // MUSIC, EFFECTS %% VIDEOS
    this.load.audio('trance', 'audio/trance.mp3');
    this.load.audio('trance2', 'audio/trance2.mp3');
    this.load.audio('trance3', 'audio/trance3.mp3');
    this.load.audio('sfxDestroyMarkerTouched', 'audio/soundAnimation.mp3');
    this.load.audio('sfxDestroyMarkerUntouched', 'audio/sfxDestroyMarkerUntouched.wav');
    this.load.audio('contactError', 'audio/contactError.wav');
    this.load.audio('cardio', 'audio/cardio.wav');
    this.load.audio('agility', 'audio/agilidad.wav');
    this.load.audio('flexibility', 'audio/flexibilidad.wav');
    this.load.audio('mitad', 'audio/mitad.wav');
    this.load.audio('fallos', 'audio/fallos.wav');
    this.load.audio('ritmo', 'audio/ritmo.wav');
    this.load.audio('posicion', 'audio/posicion.wav');
    this.load.audio('vamos', 'audio/posicion.wav');
    this.load.audio('audioTutorial', 'audio/tutorial.mp3');
    this.load.video('tutorial','img/tutorial.mp4','tutorial',false, true)
    
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
