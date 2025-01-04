function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('tiles', 'assets/tilesets/blocks.png');
    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('portal', 'assets/images/portal.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/levels.json');
    this.load.spritesheet('player', 'assets/spritesheets/player.png', 
      { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('capsule', 'assets/spritesheets/capsule.png', 
        { frameWidth: 32, frameHeight: 32 });
    }
  