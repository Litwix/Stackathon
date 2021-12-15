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

export default class Rogue extends Phaser.Physics.Arcade.Sprite {
  private facingBack = false;
  private healthState = HealthState.ALIVE;
  private damageTime = 0;
  private _health = 3;

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

  handleDamage(direction: Phaser.Math.Vector2) {
    if (this._health <= 0) return; // check first if dead to avoid repeated death logic/animations
    if (this.healthState === HealthState.DAMAGE) return; // check to avoid continuous damage in certain span time
    this.setVelocity(direction.x, direction.y);
    this.setTint(0xff0000);
    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;
    if (!this.facingBack) {
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

    const speed = 100;
    if (cursors.left.isDown) {
      this.facingBack = false;
      this.anims.play('rogue-run-front', true);
      this.scaleX = -1;
      this.body.offset.x = 34;
      this.setVelocity(-speed, 0);
    } else if (cursors.right.isDown) {
      this.facingBack = false;
      this.anims.play('rogue-run-front', true);
      this.scaleX = 1;
      this.body.offset.x = 14;
      this.setVelocity(speed, 0);
    } else if (cursors.up.isDown) {
      this.facingBack = true;
      this.anims.play('rogue-run-back', true);
      this.setVelocity(0, -speed);
    } else if (cursors.down.isDown) {
      this.facingBack = false;
      this.anims.play('rogue-run-front', true);
      this.setVelocity(0, speed);
    } else {
      this.facingBack
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
