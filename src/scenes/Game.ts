import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createRogueAnims } from '../animations/RogueAnims';
import { createSlimeAnims } from '../animations/SlimeAnims';
import Slime from '../characters/Slime';

export default class Game extends Phaser.Scene {
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
    const tileset = map.addTilesetImage('dungeon', 'dungeons');

    const wallsLayer = map.createLayer('Walls', tileset);
    const groundLayer = map.createLayer('Ground', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });
    groundLayer.setCollisionByProperty({ collides: true });

    // DEBUGGING COLLISIONS:
    // debugDraw(wallsLayer, this);
    // debugDraw(groundLayer, this);

    // ANIMATIONS:
    createRogueAnims(this.anims);
    createSlimeAnims(this.anims);

    // CHARACTERS:
    // Rogue Character:
    this.rogue = this.physics.add.sprite(73, 50, 'rogue', 'idleFront-1.png');
    this.rogue.body.setSize(this.rogue.width * 0.4, this.rogue.height * 0.6);
    this.rogue.anims.play('rogue-idle-front');

    // Slime Group:
    const slimes = this.physics.add.group({ classType: Slime });
    const slime1 = slimes.get(150, 150, 'slime');
    slime1.body.setSize(slime1.width * 0.5, slime1.height * 0.5); // will have to refactor this later

    // COLLIDERS:
    this.physics.add.collider(this.rogue, wallsLayer);
    this.physics.add.collider(this.rogue, groundLayer);
    this.physics.add.collider(slimes, wallsLayer);
    this.physics.add.collider(slimes, groundLayer);
    this.physics.add.collider(this.rogue, slimes);

    // FOLLOWING CAMERA:
    this.cameras.main.startFollow(this.rogue);
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
