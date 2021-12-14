import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('dungeons', 'dungeons/DungeonTiles.png');
    this.load.tilemapTiledJSON('dungeon01', 'dungeons/dungeon-01.json');

    this.load.atlas('rogue', 'character/Rogue.png', 'character/Rogue.json');
    this.load.atlas(
      'slime',
      'characters/slime/Slime.png',
      'characters/slime/Slime.json'
    );
  }

  create() {
    this.scene.start('game');
  }
}
