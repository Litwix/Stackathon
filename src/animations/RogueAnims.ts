import Phaser from 'phaser';

const createRogueAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Animation for idling in front-facing Rogue:
  anims.create({
    key: 'rogue-idle-front',
    frames: anims.generateFrameNames('rogue', {
      start: 1,
      end: 8,
      prefix: 'idleFront-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  });

  // Animation for idling in back-facing Rogue:
  anims.create({
    key: 'rogue-idle-back',
    frames: anims.generateFrameNames('rogue', {
      start: 1,
      end: 8,
      prefix: 'idleBack-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  });

  // Animation for running in front-facing Rogue:
  anims.create({
    key: 'rogue-run-front',
    frames: anims.generateFrameNames('rogue', {
      start: 1,
      end: 6,
      prefix: 'runFront-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  });

  // Animation for running in back-facing Rogue:
  anims.create({
    key: 'rogue-run-back',
    frames: anims.generateFrameNames('rogue', {
      start: 1,
      end: 6,
      prefix: 'runBack-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  });

  // Animation for taking damage:
  anims.create({
    key: 'rogue-damage',
    frames: anims.generateFrameNames('rogue', {
      start: 1,
      end: 3,
      prefix: 'takeDamage-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  });

  // Animation for dying:
  anims.create({
    key: 'rogue-death',
    frames: anims.generateFrameNames('rogue', {
      start: 1,
      end: 5,
      prefix: 'death-',
      suffix: '.png',
    }),
    frameRate: 10,
  });
};

export { createRogueAnims };
