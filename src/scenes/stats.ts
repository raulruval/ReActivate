import Constants from '~/constants';
import Utils from '~/utils';

export default class Stats extends Phaser.GameObjects.Image {

    private mystats;
    private TitleTxt: Phaser.GameObjects.Text;
    private bodyTxt: Phaser.GameObjects.Text;
    private backgroundStats;
    private expBarGraphic: Phaser.GameObjects.Graphics;
    private mywidth: number;
    private myheight: number;
    private hsv;
    private timerEvent;
    private barColor = [3];
    private progress = [3];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.mywidth = x;
        this.myheight = y;

        this.backgroundStats = this.scene.add.image(this.mywidth, this.myheight, texture);
        // this.backgroundStats.setScale(0.9, 0.85);

        this.TitleTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 4, 'Estadísticas', {
            fontFamily: 'Russo One',
            fontSize: '45px',
            color: '#FFFFFF',
            fontStyle: 'normal',
        });

        this.showStats();

    }

    showStats() {

        var myMaxStatCardio: JSON = Utils.getMaxStatFromStorage("cardio");
        var myMaxStatAgilidad: JSON = Utils.getMaxStatFromStorage("agility");

        console.log("maxTodos" + JSON.stringify(myMaxStatCardio))
        if (myMaxStatCardio) {
            var content = [
                "Tipo de entrenamiento: " + myMaxStatCardio["_workout"],
                "Fecha del entrenamiento: " + myMaxStatCardio["_date"],
                "Máximo nivel alcanzado: " + myMaxStatCardio["_maxLevel"],
                "Marcadores alcanzados: " + myMaxStatCardio["_touchedMarkers"],
                "Marcadores no alcanzados: " + myMaxStatCardio["_untouchedMarkers"],
            ];
            this.progress[0] = myMaxStatCardio["_maxLevel"] * 100;
            this.progress[1] = myMaxStatCardio["_touchedMarkers"] * 10;
            this.progress[2] = myMaxStatCardio["_untouchedMarkers"] * 10;
            // this.barColor[0] = this.setBarColor()

            this.bodyTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 2, content, {
                fontFamily: 'Russo One',
                fontSize: '25px',
                color: '#FFFFFF',
                fontStyle: 'normal',

            });
            this.bodyTxt.setLineSpacing(15);
            this.hsv = Phaser.Display.Color.HSVColorWheel();
            this.expBarGraphic = this.scene.add.graphics({ x: this.mywidth / 2 + 223, y: this.myheight / 2 + 90 })
            this.timerEvent = this.scene.time.addEvent({ delay: 3000, loop: false });
            this.expBarGraphic.clear();
        }
    }

    setBarColor(status,i) {
        if (status = 0) { //red
            this.barColor[i] = 8;
        } else if (status = 1) { // yellow
            this.barColor[i] = 60;
        } else if (status = 2) { // green
            this.barColor[i] = 120;

        }
    }

    updateAnimationStats() {
        if (this.timerEvent.getProgress() < 1) {
            for (var i = 0; i <= 2; i++) {
                this.expBarGraphic.fillStyle(this.hsv[this.barColor[i]].color, 1)
                this.expBarGraphic.fillRect(0, i * 43.5, this.progress[i] < 520 ? this.progress[i] : 520 * this.timerEvent.getProgress(), 20)
            }
        }
    }

    destroyStats() {
        this.backgroundStats.destroy();
        this.TitleTxt.destroy();
        if (this.bodyTxt) {
            this.bodyTxt.destroy();
        }
        this.expBarGraphic.destroy();
    }

}
