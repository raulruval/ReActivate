import Phaser from 'phaser';
import MainMenu from './scenes/menu';
import HelloWorldScene from '~/scenes/hello-world-scene';
import Workout from './scenes/workout-cardio';
import Loader from './scenes/loader';
import HUD from './scenes/hud';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then((r) => console.info('Service worker registered!'));
}

const game = new Phaser.Game({
  type: Phaser.AUTO, // Will pick WEBGL if available; CANVAS, otherwise
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  autoFocus: true,
  scene: [Loader, MainMenu, Workout, HelloWorldScene, HUD],
});

export default game;
