function preload() {
    this.load.image('splash', 'assets/images/crypt raider title.png');
    this.load.image('glow', 'assets/images/glow.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('tiles', 'assets/tilesets/blocks.png');
    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('portal', 'assets/images/portal.png');
   // this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/maps.json');
    this.load.spritesheet('player', 'assets/spritesheets/player.png', 
      { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('capsule', 'assets/spritesheets/capsule.png', 
        { frameWidth: 32, frameHeight: 32 });
    }
  