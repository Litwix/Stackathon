import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import '../characters/Rogue';
import Rogue from '../characters/Rogue';
import Slime from '../characters/Slime';
import { createRogueAnims } from '../animations/RogueAnims';
import { createSlimeAnims } from '../animations/SlimeAnims';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private rogue!: Rogue;

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
    this.rogue = this.add.rogue(73, 50, 'rogue');

    // Slime Group:
    const slimes = this.physics.add.group({
      classType: Slime,
      createCallback: (gameObject) => {
        const slimeGameObject = gameObject as Slime;
        slimeGameObject.body.onCollide = true;
        slimeGameObject.body.setSize(
          slimeGameObject.width * 0.5,
          slimeGameObject.height * 0.5
        );
      },
    });
    slimes.get(150, 150, 'slime');

    // COLLIDERS:
    this.physics.add.collider(this.rogue, wallsLayer);
    this.physics.add.collider(this.rogue, groundLayer);
    this.physics.add.collider(slimes, wallsLayer);
    this.physics.add.collider(slimes, groundLayer);
    this.physics.add.collider(
      this.rogue,
      slimes,
      this.handleRogueSlimeCollision,
      undefined,
      this
    );

    // FOLLOWING CAMERA:
    this.cameras.main.startFollow(this.rogue);
  }

  private handleRogueSlimeCollision(
    character: Phaser.GameObjects.GameObject,
    enemy: Phaser.GameObjects.GameObject
  ) {
    const slime = enemy as Slime;

    const dx = this.rogue.x - slime.x;
    const dy = this.rogue.y - slime.y;
    const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);

    this.rogue.handleDamage(direction);
  }

  update() {
    if (this.rogue) {
      this.rogue.update(this.cursors);
    }
  }
}
