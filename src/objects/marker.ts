import Phaser from 'phaser';

export default class Marker extends Phaser.GameObjects.Container {
  private upImage: Phaser.GameObjects.Image;
  private group!: Phaser.GameObjects.Group;
  private tween!: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, upTexture: string, id: number, sfx: string) {
    super(scene, x, y);

    const circle = new Phaser.Geom.Circle(50, 70, 40);
    this.upImage = scene.add.image(0, 0, upTexture);
    this.add(this.upImage);

    this.setSize(this.upImage.width, this.upImage.height);


    this.group = this.scene.add.group();
    this.group.createMultiple({ key: 'ball', frameQuantity: 15 });

    Phaser.Actions.PlaceOnCircle(this.group.getChildren(), circle);

    this.tween = this.scene.tweens.addCounter({
      from: 40,
      to: 30,
      duration: 2000,
      delay: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });


  }

  // this.setInteractive()
  //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
  //     // this.animateToFill(true);
  //   })
  //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
  //     // this.animateToEmpty(true);
  //   });

  animateMarker(): void {
    Phaser.Actions.RotateAroundDistance(this.group.getChildren(), { x: 50, y: 70 }, 0.02, this.tween.getValue());
  }
}
//   animateToFill(mouseAction: boolean): void {
//     this.cancelAnimationEmpty = true;
//     if (this.overImage.width < Marker.barWidth && !mouseAction) {
//       this.overImage.width = this.overImage.width + 0.02;
//     } else if (mouseAction) {
//       this.overImage.width = Marker.barWidth;
//     }
//   }

//   animateToEmpty(mouseActtion: boolean): void {
//     this.cancelAnimationEmpty = false;
//     if (this.overImage.width > 0 && !mouseActtion) {
//       while (this.overImage.width > 0 && !this.cancelAnimationEmpty) {
//         this.overImage.width = this.overImage.width - 0.01;
//       }
//     } else if (mouseActtion) {
//       this.overImage.width = 0;
//     }
//   }

//   buttonIsFull(): boolean {
//     if (this.overImage.width >= Marker.barWidth) {
//       this.overImage.width = 0;
//       return true;
//     }
//     return false;
//   }

//   getText(): string {
//     return this.buttomText.text;
//   }
