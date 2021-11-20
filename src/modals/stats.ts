import Utils from '~/utils';

export default class Stats extends Phaser.GameObjects.Image {

    private mystats;
    private TitleTxt: Phaser.GameObjects.Text;
    private bodyTxt: Phaser.GameObjects.Text;
    private background;
    private expBarGraphic: Phaser.GameObjects.Graphics;
    private circleGraphicCorrect: Phaser.GameObjects.Graphics;
    private circleGraphicFailed: Phaser.GameObjects.Graphics;
    private mywidth: number;
    private myheight: number;
    private hsv;
    private timerEvent;
    private barColor = [3];
    private progress = [3];
    private tCircle = 0.0;
    private percentFailed = 0;
    private percentCorrect = 0;
    private textCorrect;
    private textFailed;
    private stepCircle1 = 0;
    private stepCircle2 = 0;
    private currentStep1 = 0;
    private currentStep2 = 0;
    private textFailedLabel;
    private textCorrectLabel
    private nextColorG1 = 0xff0000;
    private nextColorG2 = 0xff0000;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.mywidth = x;
        this.myheight = y;

        this.background = this.scene.add.image(this.mywidth, this.myheight + 20, texture);
        this.background.setScale(1, 1.05);

        this.TitleTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 4, 'Estadísticas', {
            fontFamily: 'Russo One',
            fontSize: '40px',
            color: '#FFFFFF',
            fontStyle: 'normal',
        });
        var myMaxStat: JSON = Utils.getMaxStatFromStorage();
        if (JSON.stringify(myMaxStat)) {
            this.showStats(myMaxStat);
        } else {
            this.bodyTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 2, "No hay estadísticas disponibles", {
                fontFamily: 'Russo One',
                fontSize: '25px',
                color: '#FFFFFF',
                fontStyle: 'normal',

            });
        }

    }

    showStats(myMaxStat: JSON) {
        if (myMaxStat) {
            var content = [
                "Tipo de entrenamiento: " + myMaxStat["_workout"],
                "Fecha del entrenamiento: " + myMaxStat["_date"],
                "Máximo nivel alcanzado: " + myMaxStat["_maxLevel"],
                "Marcadores alcanzados: " + myMaxStat["_touchedMarkers"],
                "Marcadores no alcanzados: " + myMaxStat["_untouchedMarkers"],
            ];
            this.progress[0] = myMaxStat["_maxLevel"] * 25;
            this.progress[1] = myMaxStat["_touchedMarkers"] * 7.5;
            this.progress[2] = myMaxStat["_untouchedMarkers"] * 2.5;
            // Set posible colors for level
            if (myMaxStat["_maxLevel"] > 3 && myMaxStat["_maxLevel"] <= 8) {
                this.setBarColor(1, 0);
            } else if (myMaxStat["_maxLevel"] > 8) {
                this.setBarColor(2, 0);
            } else {
                this.setBarColor(0, 0);
            }
            // Set posible colors for touchedMarkers
            if (myMaxStat["_touchedMarkers"] > 10 && myMaxStat["_touchedMarkers"] <= 25) {
                this.setBarColor(1, 1);
            } else if (myMaxStat["_touchedMarkers"] > 25) {
                this.setBarColor(2, 1);
            } else {
                this.setBarColor(0, 1);
            }
            // Set posible colors for untouchedMarkers
            if (myMaxStat["_untouchedMarkers"] > 5 && myMaxStat["_untouchedMarkers"] <= 10) {
                this.setBarColor(1, 2);
            } else if (myMaxStat["_untouchedMarkers"] > 10) {
                this.setBarColor(0, 2);
            } else {
                this.setBarColor(2, 2);
            }


            this.bodyTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 2 - 20, content, {
                fontFamily: 'Russo One',
                fontSize: '25px',
                color: '#FFFFFF',
                fontStyle: 'normal',
            });

            this.percentCorrect = myMaxStat["_touchedMarkers"] / myMaxStat["_totalTouchableMarkers"] * 400;
            this.percentFailed = myMaxStat["_untouchedMarkers"] / myMaxStat["_totalTouchableMarkers"] * 400;
            this.textCorrect = this.scene.add.dynamicBitmapText(this.mywidth / 2 + 120, this.myheight / 2 + 305, 'gothic', '0%', 32);
            this.textFailed = this.scene.add.dynamicBitmapText(this.mywidth / 2 + 520, this.myheight / 2 + 305, 'gothic', '0%', 32);
            this.textCorrectLabel = this.scene.add.text(this.mywidth / 2, this.myheight / 2 + 445, "% de marcadores acertados", {
                fontFamily: 'Russo One',
                fontSize: '20px',
                color: '#FFFFFF',
                fontStyle: 'normal',

            });
            this.textFailedLabel = this.scene.add.text(this.mywidth / 2 + 385, this.myheight / 2 + 445, "% de marcadores fallados", {
                fontFamily: 'Russo One',
                fontSize: '20px',
                color: '#FFFFFF',
                fontStyle: 'normal',

            });
            this.bodyTxt.setLineSpacing(15);
            this.hsv = Phaser.Display.Color.HSVColorWheel();
            this.expBarGraphic = this.scene.add.graphics({ x: this.mywidth / 2 + 235, y: this.myheight / 2 + 70 });
            this.circleGraphicCorrect = this.scene.add.graphics({ x: this.mywidth / 2 + 150, y: this.myheight / 2 + 320 });
            this.circleGraphicFailed = this.scene.add.graphics({ x: this.mywidth / 2 + 550, y: this.myheight / 2 + 320 });

            this.timerEvent = this.scene.time.addEvent({ delay: 3000, loop: false });
            this.circleGraphicCorrect.clear();
            this.circleGraphicFailed.clear();

            this.expBarGraphic.clear();
        }
    }

    setBarColor(status, i) {
        if (status == 0) { //red
            this.barColor[i] = 8;
        } else if (status == 1) { // yellow
            this.barColor[i] = 60;
        } else if (status == 2) { // green
            this.barColor[i] = 120;
        }
    }

    updateAnimationStats() {
        if (this.timerEvent && this.timerEvent.getProgress() < 1) {
            for (var i = 0; i <= 2; i++) {
                this.expBarGraphic.fillStyle(this.hsv[this.barColor[i]].color, 1)
                this.expBarGraphic.fillRect(0, i * 43.5, (this.progress[i] < 520 ? this.progress[i] : 520) * this.timerEvent.getProgress(), 20)
            }
        }
    }

    updateAnimationCircle() {

        if (this.percentCorrect != 0 && this.stepCircle1 <= this.currentStep1) {
            this.stepCircle1 = Math.abs(Math.sin(this.tCircle)) * this.percentCorrect;
            this.circleGraphicCorrect.lineStyle(40, this.nextColorG1, 1);
            this.circleGraphicCorrect.beginPath();
            this.circleGraphicCorrect.arc(0, 0, 85, 0, Phaser.Math.DegToRad(this.stepCircle1), false);
            this.circleGraphicCorrect.strokePath();
            this.circleGraphicCorrect.closePath();
            this.tCircle += 0.004;
            this.currentStep1 = Math.abs(Math.sin(this.tCircle)) * this.percentCorrect;
            let percent = (this.stepCircle1 / 400 * 100).toFixed(0);
            this.textCorrect.setText(percent + '%')
            if (parseInt(percent) >= 25 && parseInt(percent) < 60) {
                this.nextColorG1 = 0xfaff00;
            } else if (parseInt(percent) > 60) {
                this.nextColorG1 = 0x4dff00;
            }

        }


        if (this.percentFailed != 0 && this.stepCircle2 <= this.currentStep2) {
            this.stepCircle2 = Math.abs(Math.sin(this.tCircle)) * this.percentFailed;
            this.circleGraphicFailed.lineStyle(40, this.nextColorG2, 1);
            this.circleGraphicFailed.beginPath();
            this.circleGraphicFailed.arc(0, 0, 85, 0, Phaser.Math.DegToRad(this.stepCircle2), false);
            this.circleGraphicFailed.strokePath();
            this.circleGraphicFailed.closePath();
            this.tCircle += 0.004;
            this.currentStep2 = Math.abs(Math.sin(this.tCircle)) * this.percentFailed;
            let percent = (this.stepCircle2 / 400 * 100).toFixed(0);
            this.textFailed.setText(percent + '%')
            if (parseInt(percent) >= 25 && parseInt(percent) < 60) {
                this.nextColorG2 = 0xfaff00;
            } else if (parseInt(percent) > 60) {
                this.nextColorG2 = 0x4dff00;
            }
        }

    }

    destroyStats() {
        this.background.destroy();
        this.TitleTxt.destroy();
        if (this.bodyTxt) {
            this.bodyTxt.destroy();
        }
        this.expBarGraphic.destroy();
        this.textFailed.destroy();
        this.textCorrect.destroy();
        this.textCorrectLabel.destroy();
        this.textFailedLabel.destroy();
        this.circleGraphicCorrect.destroy();
        this.circleGraphicFailed.destroy();
    }

}
