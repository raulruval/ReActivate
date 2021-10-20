import Phaser from 'phaser';

export default class CustomButtom extends Phaser.GameObjects.Container {
  private upImage: Phaser.GameObjects.Image;
  private overImage: Phaser.GameObjects.Rectangle;
  private buttomText: Phaser.GameObjects.Text;
  private cancelAnimationEmpty: boolean;
  private barWidth: number;
  private initField: number;


  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    upTexture: string,
    inputText: string,
    barWidth?: number,
    initField?: number,
  ) {
    super(scene, x, y);

    this.upImage = scene.add.image(0, 0, upTexture);
    this.barWidth = barWidth ? barWidth : 333;
    this.initField = initField ? initField : -166.7;
    this.overImage = new Phaser.GameObjects.Rectangle(scene, this.initField, 0, 0, 95, 0x34495e);
    this.buttomText = scene.add
      .text(0, 0, inputText, { fontFamily: 'Russo One', fontSize: '55px', color: '#FFFFFF', fontStyle: 'normal' })
      .setOrigin(0.5);

    this.add(this.upImage);
    this.add(this.overImage);
    this.add(this.buttomText);

    this.setSize(this.upImage.width, this.upImage.height);

    this.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.animateToFill(true);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.animateToEmpty(true);
      });
  }

  animateToFill(mouseAction: boolean): void {
    this.cancelAnimationEmpty = true;
    if (this.overImage.width < this.barWidth && !mouseAction) {
      this.overImage.width = this.overImage.width + 2;
    } else if (mouseAction) {
      this.overImage.width = this.barWidth;
    }
  }
  animateToEmpty(mouseActtion: boolean): void {
    this.cancelAnimationEmpty = false;
    if (this.overImage.width > 0 && !mouseActtion) {
      while (this.overImage.width > 0 && !this.cancelAnimationEmpty) {
        this.overImage.width = this.overImage.width - 0.5;
      }
    } else if (mouseActtion) {
      this.overImage.width = 0;
    }
  }

  buttonIsFull(): boolean {
    if (this.overImage.width >= this.barWidth) {
      this.overImage.width = 0;
      return true;
    }
    return false;
  }

  getText(): string {
    return this.buttomText.text;
  }
}
