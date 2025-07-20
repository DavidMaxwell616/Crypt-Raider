function preload() {
  this.load.image('splash', 'assets/images/crypt raider title.png');
  this.load.image('glow', 'assets/images/glow.png');
  this.load.image('level intro', 'assets/images/get ready.png');
  this.load.image('background', 'assets/images/background.png');
  this.load.spritesheet('blocks', 'assets/spritesheets/blocks.png',
    { frameWidth: 64, frameHeight: 64 });
  this.load.image('start button', 'assets/images/start button.png');
  this.load.image('level complete', 'assets/images/level complete.png');
  this.load.image('spike', 'assets/images/spike.png');
  this.load.image('portal', 'assets/images/portal.png');
  this.load.spritesheet('portal open', 'assets/spritesheets/portal open.png',
    { frameWidth: 64, frameHeight: 60 });
  this.load.spritesheet('player level won', 'assets/spritesheets/player level won.png',
    { frameWidth: 61, frameHeight: 85 });
  this.load.spritesheet('player', 'assets/spritesheets/player.png',
    { frameWidth: 34, frameHeight: 34 });
  this.load.spritesheet('capsule', 'assets/spritesheets/capsule.png',
    { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet(PLAYER_LEVEL_INTRO, 'assets/spritesheets/player_intro.png',
    { frameWidth: 87, frameHeight: 95 });
  this.load.path = '../assets/json/';
  this.load.json('levelData', 'level_data.json');
}
