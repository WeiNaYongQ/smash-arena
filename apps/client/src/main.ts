import Phaser from 'phaser';

import { AUTO_CENTER, SCALE_MODE, createBaseGameConfig } from './gameConfig.js';
import { PlaceholderScene } from './scenes/PlaceholderScene.js';

const MOUNT_ID = 'game';

function mount(): HTMLElement {
  const element = document.getElementById(MOUNT_ID);
  if (!element) {
    throw new Error(`#${MOUNT_ID} mount element is missing from index.html`);
  }
  return element;
}

new Phaser.Game({
  ...createBaseGameConfig(mount()),
  scale: {
    mode: Phaser.Scale.ScaleModes[SCALE_MODE],
    autoCenter: Phaser.Scale.Center[AUTO_CENTER],
  },
  scene: [PlaceholderScene],
});
