import Phaser from 'phaser';
import { sceneEvents } from '../events/Events';

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;
  constructor() {
    super('gameUI');
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: 'heart-full',
      setXY: { x: 15, y: 15, stepX: 17 },
      quantity: 5,
    });

    sceneEvents.on('rogue-health-changed', this.handleRogueHealthChanged, this);

    // Turn off listener after each time damage is taken to prevent buildup of unwanted listeners
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        'rogue-health-changed',
        this.handleRogueHealthChanged,
        this
      );
    });
  }

  private handleRogueHealthChanged(health: number) {
    this.hearts.children.each((gameObject, index) => {
      const heart = gameObject as Phaser.GameObjects.Image;
      if (health % 1 === 0.5) {
        const roundedHealth = Math.floor(health);
        if (index < roundedHealth) {
          heart.setTexture('heart-full');
        } else if (index === roundedHealth) {
          heart.setTexture('heart-half');
        } else {
          heart.setTexture('heart-empty');
        }
      } else {
        if (index < health) {
          heart.setTexture('heart-full');
        } else {
          heart.setTexture('heart-empty');
        }
      }
    });
  }
}
