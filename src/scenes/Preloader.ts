import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', 'tiles/DungeonTiles.png');
    this.load.tilemapTiledJSON('dungeon01', 'tiles/dungeon-01.json');

    this.load.atlas('rogue', 'characters/Rogue.png', 'characters/Rogue.json');
  }

  create() {
    this.scene.start('game');
  }
}
