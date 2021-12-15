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
      setXY: { x: 10, y: 10, stepX: 15 },
      quantity: 5,
    });
  }
}
