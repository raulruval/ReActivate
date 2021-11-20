import Utils from '~/utils';

export default class Historical extends Phaser.GameObjects.Image {
    private TitleTxt: Phaser.GameObjects.Text;
    private bodyTxt: Phaser.GameObjects.Text;
    private background;
    private mywidth: number;
    private myheight: number;
    private myStats: [];
    private actualStatGruop = 0;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.mywidth = x;
        this.myheight = y;

        this.background = this.scene.add.image(this.mywidth, this.myheight + 20, texture);
        this.background.setScale(1, 1.05);

        this.TitleTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 4, 'Historial', {
            fontFamily: 'Russo One',
            fontSize: '40px',
            color: '#FFFFFF',
            fontStyle: 'normal',
        });
        this.myStats = Utils.getLocalStorageByDate();
        if (this.myStats?.length) {
            this.showHistorical();
        } else {
            this.bodyTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 2, "Aún no has realizado ningún entrenamiento", {
                fontFamily: 'Russo One',
                fontSize: '25px',
                color: '#FFFFFF',
                fontStyle: 'normal',

            });
        }

    }

    showHistorical(next?: boolean) {

        if (next == true && this.actualStatGruop < (this.myStats.length - 3)) {
            this.actualStatGruop = this.actualStatGruop + 3;
        } else if (next == false && this.actualStatGruop > 0) {
            this.actualStatGruop = this.actualStatGruop - 3;
        }
        if (this.bodyTxt) {
            this.bodyTxt.destroy();
        }
        var content: string[] = [];
        for (var i = this.actualStatGruop; i < this.myStats.length && (i - this.actualStatGruop) < 3; i++) {
            content.push(
                "Tipo de entrenamiento: " + this.myStats[i]["_workout"],
                "Fecha del entrenamiento: " + this.myStats[i]["_date"],
                "Máximo nivel alcanzado: " + this.myStats[i]["_maxLevel"],
                "Marcadores alcanzados: " + this.myStats[i]["_touchedMarkers"],
                "Marcadores no alcanzados: " + this.myStats[i]["_untouchedMarkers"],
                "",
            );
        }

        this.bodyTxt = this.scene.add.text(this.mywidth / 4, this.myheight / 2 - 20, content, {
            fontFamily: 'Russo One',
            fontSize: '25px',
            color: '#FFFFFF',
            fontStyle: 'normal',
        });

    }

    destroyHistorical() {
        this.background.destroy();
        this.TitleTxt.destroy();
        if (this.bodyTxt) {
            this.bodyTxt.destroy();
        }
    }


}