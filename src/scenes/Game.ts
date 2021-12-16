import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import '../characters/Rogue';
import Rogue from '../characters/Rogue';
import Slime from '../characters/Slime';
import { createRogueAnims } from '../animations/RogueAnims';
import { createSlimeAnims } from '../animations/SlimeAnims';
import { sceneEvents } from '../events/Events';

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private rogue!: Rogue;
  private knives!: Phaser.Physics.Arcade.Group;
  private slimes!: Phaser.Physics.Arcade.Group;
  private rogueSlimeCollider?: Phaser.Physics.Arcade.Collider;

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run('gameUI');

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

    // KNIVES:
    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
    });

    // CHARACTERS:
    // Rogue Character:
    this.rogue = this.add.rogue(73, 50, 'rogue');
    this.rogue.setKnives(this.knives);

    // Slime Group:
    this.slimes = this.physics.add.group({
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
    this.slimes.get(150, 150, 'slime');
    this.slimes.get(500, 100, 'slime');
    this.slimes.get(700, 300, 'slime');
    this.slimes.get(100, 500, 'slime');
    this.slimes.get(300, 700, 'slime');
    this.slimes.get(200, 400, 'slime');

    // COLLIDERS:
    this.physics.add.collider(this.rogue, wallsLayer);
    this.physics.add.collider(this.rogue, groundLayer);

    this.physics.add.collider(this.slimes, wallsLayer);
    this.physics.add.collider(this.slimes, groundLayer);

    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      groundLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.slimes,
      this.handleKnifeSlimeCollision,
      undefined,
      this
    );

    this.rogueSlimeCollider = this.physics.add.collider(
      this.rogue,
      this.slimes,
      this.handleRogueSlimeCollision,
      undefined,
      this
    );

    // FOLLOWING CAMERA:
    this.cameras.main.startFollow(this.rogue);
  }

  private handleKnifeWallCollision(
    knife: Phaser.GameObjects.GameObject,
    wall: Phaser.GameObjects.GameObject
  ) {
    knife.destroy();
  }

  private handleKnifeSlimeCollision(
    knife: Phaser.GameObjects.GameObject,
    slime: Phaser.GameObjects.GameObject
  ) {
    knife.destroy();
    slime.destroy();
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

    sceneEvents.emit('rogue-health-changed', this.rogue.health);

    if (this.rogue.health <= 0) {
      this.rogueSlimeCollider?.destroy();
    }
  }

  update() {
    if (this.rogue) {
      this.rogue.update(this.cursors);
    }
  }
}
