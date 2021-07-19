import Phaser from 'phaser';

export default class CustomButtom extends Phaser.GameObjects.Container {
  private upImage: Phaser.GameObjects.Image;
  private overImage: Phaser.GameObjects.Rectangle;
  private buttomText: Phaser.GameObjects.Text;
  private cancelAnimationEmpty: boolean;
  static barWidth = 333;

  constructor(scene: Phaser.Scene, x: number, y: number, upTexture: string, inputText: string) {  
    super(scene, x, y);

    this.upImage = scene.add.image(0, 0, upTexture);

    this.overImage = new Phaser.GameObjects.Rectangle(scene, -166.7, 0, 0, 71, 0x34495e);
    this.buttomText = scene.add.text(0, 0, inputText).setOrigin(0.5).setFontSize(45).setFontFamily('Georgia');

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
    if (this.overImage.width < CustomButtom.barWidth && !mouseAction) {
      this.overImage.width = this.overImage.width + 0.02;
    } else if (mouseAction) {
      this.overImage.width = CustomButtom.barWidth;
    }
  }
  animateToEmpty(mouseActtion: boolean): void {
    this.cancelAnimationEmpty = false;
    if (this.overImage.width > 0 && !mouseActtion) {
      while (this.overImage.width > 0 && !this.cancelAnimationEmpty) {
        this.overImage.width = this.overImage.width - 0.01;
      }
    } else if (mouseActtion) {
      this.overImage.width = 0;
    }
  }

  buttonIsFull(): boolean {
    if (this.overImage.width >= CustomButtom.barWidth) {
      this.overImage.width = 0;
      return true;
    }
    return false;
  }

  getText(): string {
    return this.buttomText.text;
  }

}
