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
  private audioCardio: Phaser.Sound.BaseSound;
  private audioAgility: Phaser.Sound.BaseSound;
  private audioFlexibility: Phaser.Sound.BaseSound;
  private audioHalf: Phaser.Sound.BaseSound;
  private audioFaults: Phaser.Sound.BaseSound;
  private audioRhythm: Phaser.Sound.BaseSound;
  private audioPosition: Phaser.Sound.BaseSound;
  private audioGo: Phaser.Sound.BaseSound;
  private countFailures = 0;
  private countHits = 0;
  private workoutActive;





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

    // Motivation audio
    this.audioCardio = this.sound.add(Constants.AUDIO.CARDIO, { volume: 0.95, loop: false });
    this.audioAgility = this.sound.add(Constants.AUDIO.AGILITY, { volume: 0.95, loop: false });
    this.audioFlexibility = this.sound.add(Constants.AUDIO.FLEXIBILITY, { volume: 0.95, loop: false });
    this.audioHalf = this.sound.add(Constants.AUDIO.HALF, { volume: 0.95, loop: false });
    this.audioFaults = this.sound.add(Constants.AUDIO.FAULTS, { volume: 0.95, loop: false });
    this.audioRhythm = this.sound.add(Constants.AUDIO.RHYTHM, { volume: 0.95, loop: false });
    this.audioPosition = this.sound.add(Constants.AUDIO.POSITION, { volume: 0.95, loop: false });
    this.audioGo = this.sound.add(Constants.AUDIO.GO, { volume: 0.95, loop: false });


    if (this.scene.isActive(Constants.SCENES.WorkoutCardio)) {
      workoutCardio.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
      workoutCardio.events.on(Constants.EVENT.CLOCK, this.updateClock, this);
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.audioCardio.play();
          this.workoutActive = 'cardio';
        },
        loop: false
      });
    }
    if (this.scene.isActive(Constants.SCENES.WorkoutAgilidad)) {
      workoutAgilidad.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
      workoutAgilidad.events.on(Constants.EVENT.CLOCK, this.updateClock, this);
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.audioAgility.play();
          this.workoutActive = 'agility';
        },
        loop: false
      });
    }
    if (this.scene.isActive(Constants.SCENES.WorkoutFlexibilidad)) {
      WorkoutFlexibilidad.events.on(Constants.EVENT.UPDATEEXP, this.updateExp, this);
      WorkoutFlexibilidad.events.on(Constants.EVENT.CLOCK, this.updateClock, this);

      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.audioFlexibility.play();
          this.workoutActive = 'flexibility';
        },
        loop: false
      });
    }

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.audioGo.play();
      },
      loop: false
    });

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
    if (this.registry.get(Constants.REGISTER.EXP) < this.lastExp) {
      this.countHits = 0;
      this.countFailures++;
      if (this.countFailures == 30) {
        this.audioFaults.play();
        this.countFailures = 0;
        this.countHits = 0;
      }
    } else if (this.registry.get(Constants.REGISTER.EXP) > this.lastExp) {
      this.countFailures = 0;
      this.countHits++;
      if (this.countHits == 20) {
        this.audioRhythm.play();
        this.countFailures = 0;
        this.countHits = 0;
      }
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
    
    switch (this.workoutActive) {
      case 'cardio':
          if (this.clockTxt.text == Constants.AUDIO.DURATIONTRANCE){
            this.audioHalf.play();
          }
        break;
      case 'agility':
        if (this.clockTxt.text == Constants.AUDIO.DURATIONTRANCE2){
          this.audioHalf.play();
        }
        break;
      case 'flexibility':
        if (this.clockTxt.text == Constants.AUDIO.DURATIONTRANCE3){
          this.audioHalf.play();
        }
        break;
      default:
        break;
    }
  }
}
