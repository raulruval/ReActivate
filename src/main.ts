import Phaser from 'phaser';
import MainMenu from './scenes/menu';
import HelloWorldScene from '~/scenes/hello-world-scene';
import Workout from './scenes/workout-cardio';
import Loader from './scenes/loader';
import HUD from './scenes/hud';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then((r) => console.info('Service worker registered!'));
}

if (!('Notification' in window)) {
  console.warn('This browser does not support desktop notification');
} else if (Notification.permission !== 'granted') {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      new Notification('Physio Galenus', {
        body: 'Thank you for accepting being notified 🙂',
        icon: 'assets/img/icons/icon-512.png',
      });
    }
  });
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
