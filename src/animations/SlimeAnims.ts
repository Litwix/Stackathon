import Phaser from 'phaser';

const createSlimeAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Animation for idling slime:
  anims.create({
    key: 'slime-idle',
    frames: anims.generateFrameNames('slime', {
      start: 1,
      end: 6,
      prefix: 'idle-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  });

  // Animation for jumping slime -- will be used for "running" movement:
  anims.create({
    key: 'slime-jump',
    frames: anims.generateFrameNames('slime', {
      start: 1,
      end: 7,
      prefix: 'jump-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  });

  // Animation for slime death:
  anims.create({
    key: 'slime-death',
    frames: anims.generateFrameNames('slime', {
      start: 1,
      end: 7,
      prefix: 'death-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  });
};

export { createSlimeAnims };
