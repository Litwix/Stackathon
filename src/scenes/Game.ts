import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: 'dungeon01' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

    const wallsLayer = map.createStaticLayer('Walls', tileset);
    const groundLayer = map.createStaticLayer('Ground', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });
    groundLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
    groundLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
  }
}
