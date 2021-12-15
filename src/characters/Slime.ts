import Phaser from 'phaser';

enum Direction { // In TypeScript, ENUMs will be assigned a number by default (starting w/ 0)
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3); // Can use these numbers for ENUMs
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }
  return newDirection;
};

export default class Slime extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private moveEvent: Phaser.Time.TimerEvent;
  private speed = 50;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play('slime-jump');

    // Slime changes direction randomly when it hits a tile
    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    // Slime changes direction randomly every 2.5 seconds
    this.moveEvent = scene.time.addEvent({
      delay: 2500,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  // Gets rid of moveEvent if no longer in scene to prevent memory leakage
  destroy(fromScene?: boolean) {
    this.moveEvent.destroy(); // Want to call this before super in this case, so that the parent doesn't destroy something we may still need
    super.destroy(fromScene);
  }

  private handleTileCollision(
    gameObject: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (gameObject !== this) return;
    this.direction = randomDirection(this.direction);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -this.speed);
        break;
      case Direction.DOWN:
        this.setVelocity(0, this.speed);
        break;
      case Direction.LEFT:
        this.setVelocity(-this.speed, 0);
        break;
      case Direction.RIGHT:
        this.setVelocity(this.speed, 0);
        break;
    }
  }
}
