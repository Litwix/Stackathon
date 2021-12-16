import Phaser from 'phaser';

declare global {
  // Declaration Merging: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      rogue(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Rogue;
    }
  }
}

enum HealthState {
  ALIVE,
  DAMAGE,
  DEAD,
}

enum Facing {
  FRONT,
  BACK,
  LEFT,
  RIGHT,
}

export default class Rogue extends Phaser.Physics.Arcade.Sprite {
  private facing = Facing.FRONT;
  private healthState = HealthState.ALIVE;
  private damageTime = 0;
  private _health = 3;
  private knives?: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play('rogue-idle-front');
  }

  // GETTERS AND SETTERS:
  get health() {
    return this._health;
  }

  setKnives(knives: Phaser.Physics.Arcade.Group) {
    this.knives = knives;
  }

  private throwKnife() {
    if (!this.knives) return;

    const knife = this.knives.get(
      this.x,
      this.y,
      'knife'
    ) as Phaser.Physics.Arcade.Image;

    if (!knife) return;

    const vector = new Phaser.Math.Vector2(0, 0);
    switch (this.facing) {
      case Facing.LEFT:
        vector.x = -1;
        break;
      case Facing.RIGHT:
        vector.x = 1;
        break;
      case Facing.BACK:
        vector.y = -1;
        break;
      default:
      case Facing.FRONT:
        vector.y = 1;
        break;
    }

    const angle = vector.angle();
    knife.setActive(true);
    knife.setVisible(true);
    knife.setRotation(angle);
    knife.x += vector.x * 15;
    knife.y += vector.y * 15;
    knife.setVelocity(vector.x * 250, vector.y * 250);
  }

  handleDamage(direction: Phaser.Math.Vector2) {
    if (this._health <= 0) return; // check first if dead to avoid repeated death logic/animations
    if (this.healthState === HealthState.DAMAGE) return; // check to avoid continuous damage in certain span time
    this.setVelocity(direction.x, direction.y);
    this.setTint(0xff0000);
    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;
    if (!(this.facing === Facing.BACK)) {
      this.anims.play('rogue-damage', true);
    }
    this._health -= 0.5;
    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.anims.play('rogue-death');
      this.setVelocity(0, 0);
    }
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);
    switch (this.healthState) {
      case HealthState.ALIVE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.ALIVE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

    if (!cursors) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
      this.throwKnife();
      return;
    }

    const speed = 100;
    if (cursors.left.isDown) {
      this.facing = Facing.LEFT;
      this.anims.play('rogue-run-front', true);
      this.scaleX = -1;
      this.body.offset.x = 34;
      this.setVelocity(-speed, 0);
    } else if (cursors.right.isDown) {
      this.facing = Facing.RIGHT;
      this.anims.play('rogue-run-front', true);
      this.scaleX = 1;
      this.body.offset.x = 14;
      this.setVelocity(speed, 0);
    } else if (cursors.up.isDown) {
      this.facing = Facing.BACK;
      this.anims.play('rogue-run-back', true);
      this.setVelocity(0, -speed);
    } else if (cursors.down.isDown) {
      this.facing = Facing.FRONT;
      this.anims.play('rogue-run-front', true);
      this.setVelocity(0, speed);
    } else {
      this.facing === Facing.BACK
        ? this.anims.play('rogue-idle-back', true)
        : this.anims.play('rogue-idle-front', true);
      this.setVelocity(0, 0);
    }
  }
}

// Allows us to create our main rogue character:
Phaser.GameObjects.GameObjectFactory.register(
  'rogue',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    let rogue = new Rogue(this.scene, x, y, texture, frame);

    this.displayList.add(rogue); // Can access displayList and updateList since we set the context of "this"
    this.updateList.add(rogue);

    this.scene.physics.world.enableBody(
      rogue,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    rogue.body.setSize(rogue.width * 0.4, rogue.height * 0.6);

    return rogue;
  }
);
