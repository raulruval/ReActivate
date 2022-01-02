import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import Phaser, { Scene } from 'phaser';
import Marker from '~/gameobjects/marker';
import Constants from '~/constants';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';
import CustomButtom from '~/gameobjects/custom-button';
import StatsData from '~/statsData';
import Utils from '~/utils';
import Menu from './menu';
const sVi = [2, 8, 14, 20]; // Izquierda vertical
const sVd = [5, 11, 17, 23]; // Derecha vertical
const s1 = [3, 8, 14, 21];
const s2 = [4, 11, 17, 22];
const sHi = [7, 8, 9];
const sHd = [10, 11, 12];
const sequences = [sVi, sVd, s1, s2, sHi, sHd];


export default class WorkoutFlexibilidad extends AbstractPoseTrackerScene {
    private bodyPoints: Phaser.Physics.Arcade.Sprite[] = [];
    private markers: any[] = [];
    private triggerAction: boolean = true;
    private exp: number = 0;
    private levelTime: number;
    private remainingTime: number;
    private audioScene: Phaser.Sound.BaseSound;
    private workoutStarted: boolean = false;
    private silhouetteImage: Phaser.GameObjects.Image;
    private buttonsReady: any[] = [];
    private buttonReadyLeft;
    private buttonReadyRight;
    private getReadyLeft: boolean = false;
    private getReadyRight: boolean = false;
    private randomSequence: number = 3;
    private buttonExitMarker;
    private touchingButton: boolean = false;
    /* multipleMarker y errorMarker son asignadas cada vez que es necesario crear marcadores nuevos teniendo en cuenta la probabilidad en el nivel */
    private nextSequence: number = 1;
    private invertDirection = false;
    private currentMarkersAlive: number = 0;
    private maxMarkers: number = sequences[3].length; // Se empieza con al menos 1 secuencia
    private currentLevel: number = 1;
    private width: number;
    private height: number;
    private touchedMarkers: number = 0;
    private untouchedMarkers: number = 0;
    private totalTouchableMarkers: number = 0;
    private nextSequenceDirectionCopy: number[] = [];
    private controlNextMarker: number = 0;
    private prevMarker;
    private showNextSequence: boolean = true;


    constructor() {
        super(Constants.SCENES.WorkoutFlexibilidad);
    }

    init() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }

    create(): void {
        super.create();

        /************** Buttons Init *********/
        this.buttonExitMarker = new CustomButtom(this, 1200, 52, 'out', '[➔', 95, -48);
        this.buttonExitMarker.setScale(0.9, 0.85);
        this.buttonsReady.push(this.buttonExitMarker);

        this.buttonReadyLeft = new CustomButtom(this, 340, 230, 'getReady', 'I', 95, -48);
        this.buttonReadyLeft.setScale(0.9, 0.85);
        this.buttonsReady.push(this.buttonReadyLeft);

        this.buttonReadyRight = new CustomButtom(this, 940, 230, 'getReady', 'D', 95, -48);
        this.buttonReadyRight.setScale(0.9, 0.85);
        this.buttonsReady.push(this.buttonReadyRight);

        this.buttonsReady.forEach((button) => {
            this.add.existing(button);
            this.physics.world.enable(button);
            button.body.setAllowGravity(false);
        });
        this.silhouetteImage = this.add.image(640, 420, 'silhouette');
        this.silhouetteImage.setScale(0.7, 0.65);
        // body points
        for (var i = 0; i < 22; i++) {
            let point = this.physics.add.sprite(-20, -20, 'point');
            this.add.existing(point);
            this.bodyPoints.push(point);
        }

        /*****************************************/

        this.audioScene = this.sound.add(Constants.AUDIO.TRANCE3, { volume: 0.40,loop: false });

        /************** Get ready markers ******** */
        this.buttonsReady.forEach((button) => {

            this.bodyPoints.forEach((point) => {
                this.physics.add.overlap(
                    button,
                    point,
                    () => {
                        button.animateToFill(false);
                        this.touchingButton = true;
                        if (button.buttonIsFull() && button.isEnabled()) {
                            button.emit('down', button);
                        }
                    },
                    undefined,
                    this,
                );
            });

            if (button) {
                button.setInteractive()
                    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                        button.animateToFill(true);
                    })
                    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                        button.animateToEmpty(true);
                    })
                    .on('down', () => {
                        button.animateToFill(true);
                        this.touchingButton = true;
                        if (button.buttonIsFull() && button.isEnabled()) {
                            this.menuSwitch(button);
                        }
                    })
                    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                        button.animateToFill(true);
                        this.touchingButton = true;
                        if (button.buttonIsFull() && button.isEnabled()) {
                            this.menuSwitch(button);
                        }
                    });
            }
        });
        /***************************************** */

        /************** Time control ************** */
        this.levelTime = 1;
        this.remainingTime = 7 * 60 + 7;
        this.registry.set(Constants.REGISTER.EXP, this.exp);
        /***************************************** */

        if (this.scene.get(Constants.SCENES.Menu))
            this.scene.remove(Constants.SCENES.Menu);
    }


    menuSwitch(button: CustomButtom) {
        switch (button.getText()) {
            case '[➔':
                this.stopScene();
                break;
            case 'I':
                this.getReadyLeft = true;
                break;
            case 'D':
                this.getReadyRight = true;
                break;
            default:
                break;
        }
        if (this.getReadyLeft && this.getReadyRight) {
            this.startWorkout();
        }
    }

    startWorkout() {
        this.createLayout();
        this.workoutStarted = true;
        this.silhouetteImage.destroy();
        this.buttonsReady.forEach((button) => {
            if (button.getText() != '[➔')
                button.destroy();
        });
        this.audioScene.play();
        this.getReadyLeft = false;
        this.getReadyRight = false;
        this.sound.pauseOnBlur = false;
    }

    movePoints(coords: IPoseLandmark[] | undefined) {
        if (this.bodyPoints && coords) {
            for (var i = 0; i < this.bodyPoints.length; i++) {
                this.bodyPoints[i]?.setPosition(coords[i + 11]?.x * 1280, coords[i + 11]?.y * 720);
            }
        }
    }

    createLayout(): void {
        let width: number = 50;
        let height: number = 160;

        for (var i = 1; i < 25; i++) {
            const marker = new Marker({
                scene: this,
                x: width,
                y: height,
                texture: Constants.TRANSPARENTMARKER.ID,
                id: i,
            });
            marker.setDefaultBall("triangle", "redTriangle");
            if (i % 6 == 0) {
                if (i > 17) {
                    height = height + 140;
                } else {
                    height = height + 170;
                }
                width = 50;
            } else {
                if (i % 3 == 0) {
                    width = width + 660;
                } else {
                    width = width + 130; // 50 + 130 * 3 = 440
                }
            }

            this.markers.push(marker);
            this.bodyPoints.forEach((point) => {
                this.physics.add.overlap(
                    marker,
                    point,
                    (marker: any) => {
                        if (marker.getAnimationCreated()) {
                            marker.destroyMarkerAnimation(true);
                            this.destroyMarker(marker, true);
                        }
                    },
                    undefined,
                    this,
                );
            });
        }
    }

    stopScene() {
        this.saveData();
        this.audioScene.stop();
        this.scene.stop();
        if (!this.scene.get(Constants.SCENES.Menu))
            this.scene.add(Constants.SCENES.Menu, Menu, false, { x: 400, y: 300 });
        this.scene.start(Constants.SCENES.Menu);
    }

    destroyMarker(marker: any, touched: boolean): void {
        this.currentMarkersAlive--;
        this.showNextSequence = false;
        this.exp = Number(this.registry.get(Constants.REGISTER.EXP));
        if ((marker.getErrorMarker() && touched) || (!marker.getErrorMarker() && !touched)) {
            if (Number(this.registry.get(Constants.REGISTER.EXP)) > 0) {
                this.exp = this.exp - 10;
                if (!marker.getErrorMarker() && !touched) this.untouchedMarkers = this.untouchedMarkers + 1;
            }
            this.nextSequenceDirectionCopy = this.nextSequenceDirectionCopy.filter(id => id !== marker.id)
        } else if (!marker.getErrorMarker() && touched) {
            this.exp = this.exp + 10;
            this.invertDirection ? this.nextSequenceDirectionCopy.pop() : this.nextSequenceDirectionCopy.shift();
            if (this.nextSequenceDirectionCopy.length > 0) {
                this.markers.forEach(marker => {
                    var nextMarker = this.invertDirection ? this.nextSequenceDirectionCopy[this.nextSequenceDirectionCopy.length - 1] : this.nextSequenceDirectionCopy[0];
                    if (marker.id === nextMarker) {
                        marker.setErrorMarker(false);
                    }
                })
            }
            if (!marker.getErrorMarker() && touched) this.touchedMarkers = this.touchedMarkers + 1;
        }
        this.registry.set(Constants.REGISTER.EXP, this.exp);
        this.events.emit(Constants.EVENT.UPDATEEXP);
        // Update variables for next markers
        if (this.currentMarkersAlive == 0) {
            this.time.addEvent({
                delay: 1500,                // ms
                callback: () => {
                    this.controlNextMarker = 1;
                    this.currentLevel = Number(this.registry.get(Constants.REGISTER.LEVEL))
                    this.probabilityTypesMarkers(0.5);
                    this.randomSequence = Utils.random(0, sequences.length - 1);
                    this.maxMarkers = sequences[this.randomSequence].length;
                    this.showNextSequence = true;
                },
            });
        }
    }

    probabilityTypesMarkers(probInv: number) {
        let rand = Math.random();
        rand < probInv ? (this.invertDirection = true) : (this.invertDirection = false);
        this.nextSequence = Utils.random(0, sequences.length - 1);
    }

    saveData() {
        var date: string = Utils.getActualDate();
        var statsData = new StatsData("flexibilidad", date, this.currentLevel, this.touchedMarkers, this.untouchedMarkers, this.totalTouchableMarkers);
        Utils.setLocalStorageData(statsData);
    }

    /* ***************************************************************************** */
    update(time: number, delta: number): void {
        if (!this.touchingButton) {
            this.buttonsReady.forEach((button) => {
                this.bodyPoints.forEach((point) => {
                    if (point.body && point.body.touching.none) {
                        button.animateToEmpty(false);
                    }
                });
            });
        }
        this.touchingButton = false;
        super.update(time, delta, {
            renderElementsSettings: {
                shouldDrawFrame: true,
                shouldDrawPoseLandmarks: true,
            },
            beforePaint: (poseTrackerResults, canvasTexture) => {
                this.movePoints(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks : undefined);
            },
            afterPaint: (poseTrackerResults) => { },
        });
        /****************************************************************************** */
        if (this.workoutStarted) {
            this.markers.forEach((marker) => {
                if (marker.getAnimationCreated()) {
                    // Si tiene animación actualizala.
                    marker.update();
                }
                /* Lógica para crear los marcadores */
                if (sequences[this.randomSequence].includes(marker.id) && this.showNextSequence) {
                    if (!marker.getAnimationCreated() && this.triggerAction && this.currentMarkersAlive < this.maxMarkers) {
                        this.nextSequenceDirectionCopy = Array.from(sequences[this.randomSequence]);
                        var rotation = 1.57;
                        var horizontalSequence = sequences[this.randomSequence].length == 3 ? true : false;
                        if (!this.invertDirection && marker.id != this.nextSequenceDirectionCopy[0]) {
                            marker.setErrorMarker(true);
                        } else if (this.invertDirection && marker.id != this.nextSequenceDirectionCopy[this.nextSequenceDirectionCopy.length - 1]) {
                            marker.setErrorMarker(true);
                        }
                        else {
                            marker.setErrorMarker(false);
                            this.controlNextMarker = 1;
                        }
                        // Set rotation in vertical sequences
                        if (!horizontalSequence) {
                            if (!this.invertDirection) {
                                rotation += 3.141;
                            }
                            if (marker.id != this.nextSequenceDirectionCopy[this.nextSequenceDirectionCopy.length - 1]) {
                                rotation += Phaser.Math.Angle.Between(this.markers.find((marker) => marker.id === this.nextSequenceDirectionCopy[this.controlNextMarker]).x, this.markers.find((marker) => marker.id === this.nextSequenceDirectionCopy[this.controlNextMarker]).y, marker.x, marker.y);
                            } else {
                                rotation += Phaser.Math.Angle.Between(marker.x, marker.y, this.prevMarker.x, this.prevMarker.y);
                            }
                        }
                        // Set rotation in invert direction sequences
                        if (!this.invertDirection && horizontalSequence) {
                            rotation = 1.57;
                        } else if (this.invertDirection && horizontalSequence) {
                            rotation = -1.57;
                        }
                        marker.setDirectionAngle(rotation);
                        this.prevMarker = marker;
                        marker.createAnimation();
                        if (this.controlNextMarker < this.nextSequenceDirectionCopy.length - 1) {
                            this.controlNextMarker = this.controlNextMarker + 1;
                        }
                        this.currentMarkersAlive++;
                        this.totalTouchableMarkers++;
                    }
                }
                if (marker.isInternalTimerConsumed() && marker.getAnimationCreated()) {
                    marker.destroyMarkerAnimation(false);
                    this.destroyMarker(marker, false);
                }
            });

            this.triggerAction = false;
            if (this.currentMarkersAlive == 0) {
                this.triggerAction = true;
            }

            // Time Management
            if (this.levelTime != Math.floor(Math.abs(time / 1000))) {
                this.levelTime = Math.floor(Math.abs(time / 1000));
                this.remainingTime--;

                let minutes: number = Math.floor(this.remainingTime / 60);
                let seconds: number = Math.floor(this.remainingTime - minutes * 60);

                let clockText: string =
                    Phaser.Utils.String.Pad(minutes, 2, '0', 1) + ':' + Phaser.Utils.String.Pad(seconds, 2, '0', 1);
                // Register
                this.registry.set(Constants.REGISTER.CLOCK, clockText);
                // Send to HUD
                this.events.emit(Constants.EVENT.CLOCK);

                // End of workout
                if (this.remainingTime == 0) {

                    this.stopScene();
                }
            }
        }
    }
}
