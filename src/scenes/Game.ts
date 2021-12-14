import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('game');
  }
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private rogue!: Phaser.Physics.Arcade.Sprite;
  private facingBack = false;

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: 'dungeon01' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

    const wallsLayer = map.createStaticLayer('Walls', tileset);
    const groundLayer = map.createStaticLayer('Ground', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });
    groundLayer.setCollisionByProperty({ collides: true });

    // Used to debug collisions:
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

    this.rogue = this.physics.add.sprite(250, 50, 'rogue', 'idleFront-1.png');
    this.rogue.body.setSize(this.rogue.width * 0.4, this.rogue.height * 0.6);

    // Animations:
    this.anims.create({
      key: 'rogue-idle-front',
      frames: this.anims.generateFrameNames('rogue', {
        start: 1,
        end: 8,
        prefix: 'idleFront-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: 'rogue-idle-back',
      frames: this.anims.generateFrameNames('rogue', {
        start: 1,
        end: 8,
        prefix: 'idleBack-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: 'rogue-run-front',
      frames: this.anims.generateFrameNames('rogue', {
        start: 1,
        end: 6,
        prefix: 'runFront-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: 'rogue-run-back',
      frames: this.anims.generateFrameNames('rogue', {
        start: 1,
        end: 6,
        prefix: 'runBack-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.rogue.anims.play('rogue-idle-front');

    // Colliders:
    this.physics.add.collider(this.rogue, wallsLayer);
    this.physics.add.collider(this.rogue, groundLayer);
  }

  update() {
    if (!this.cursors || !this.rogue) {
      return;
    }

    const speed = 100;
    if (this.cursors.left.isDown) {
      this.facingBack = false;
      this.rogue.anims.play('rogue-run-front', true);
      this.rogue.scaleX = -1;
      this.rogue.body.offset.x = 34;
      this.rogue.setVelocity(-speed, 0);
    } else if (this.cursors.right.isDown) {
      this.facingBack = false;
      this.rogue.anims.play('rogue-run-front', true);
      this.rogue.scaleX = 1;
      this.rogue.body.offset.x = 14;
      this.rogue.setVelocity(speed, 0);
    } else if (this.cursors.up.isDown) {
      this.facingBack = true;
      this.rogue.anims.play('rogue-run-back', true);
      this.rogue.setVelocity(0, -speed);
    } else if (this.cursors.down.isDown) {
      this.facingBack = false;
      this.rogue.anims.play('rogue-run-front', true);
      this.rogue.setVelocity(0, speed);
    } else {
      this.facingBack
        ? this.rogue.anims.play('rogue-idle-back', true)
        : this.rogue.anims.play('rogue-idle-front', true);
      this.rogue.setVelocity(0, 0);
    }
  }
}
