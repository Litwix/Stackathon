import Phaser from 'phaser';

export default class GameUI extends Phaser.Scene {
  constructor() {
    super('gameUI');
  }

  create() {
    const hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    hearts.createMultiple({
      key: 'heart-full',
      setXY: { x: 15, y: 15, stepX: 17 },
      quantity: 3,
    });
  }
}
