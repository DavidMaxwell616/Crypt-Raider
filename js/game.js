const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 900,
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
  }
};

const game = new Phaser.Game(config);
const BLOCK_SIZE = 50;

function preload() {
  this.load.image('background', 'assets/images/background.png');
  this.load.image('tiles', 'assets/tilesets/blocks.png');
  this.load.image('spike', 'assets/images/spike.png');
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
  this.load.spritesheet('player', 'assets/spritesheets/player.png', 
    { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('capsule', 'assets/spritesheets/capsule.png', 
      { frameWidth: 32, frameHeight: 32 });
  }

function create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('blocks', 'tiles', 64, 64)
  const backgroundImage = this.add.image(0, 0, 'background');
  backgroundImage.setOrigin(0);
  const platforms = map.createLayer('Platforms', tileset, 0, BLOCK_SIZE);
  // There are many ways to set collision between tiles and players
  // As we want players to collide with all of the platforms, we tell Phaser to
  // set collisions for every tile in our platform layer whose index isn't -1.
  // Tiled indices can only be >= 0, therefore we are colliding with all of
  // the platform layer
  platforms.setCollisionByExclusion(-1, true);

  // Add the player to the game world
  this.player = this.physics.add.sprite(13*BLOCK_SIZE, 3*BLOCK_SIZE,'player').setScale(1.6).setOrigin(0);;
  this.player.setBounce(0.1); // our player will bounce from items
  this.player.setCollideWorldBounds(true); // don't go out of the map
  this.physics.add.collider(this.player, platforms);
 
  this.capsule = this.physics.add.sprite(6*BLOCK_SIZE, 3*BLOCK_SIZE,'capsule').setScale(1.6).setOrigin(0);;
//  this.capsule.setBounce(0.1); // our player will bounce from items
  this.capsule.setCollideWorldBounds(true); // don't go out of the map
  this.capsule.setGravityY(500);
   this.physics.add.collider(this.capsule, platforms);
  this.physics.add.collider(this.capsule, this.player);

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { frames: [ 4, 5, 6 ] }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { frames: [ 0 ] }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'walk_down',
    frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 3 ] }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'walk_up',
    frames: this.anims.generateFrameNumbers('player', { frames: [ 8, 9, 10 ] }),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: 'capsule',
    frames: this.anims.generateFrameNumbers('capsule'),
    frameRate: 8,
    repeat: -1
  });
  this.capsule.play('capsule', true);
  // Enable user input via cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

  return;
  // Create a sprite group for all spikes, set common properties to ensure that
  // sprites in the group don't move via gravity or by player collisions
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  // Get the spikes from the object layer of our Tiled map. Phaser has a
  // createFromObjects function to do so, but it creates sprites automatically
  // for us. We want to manipulate the sprites a bit before we use them
  map.getObjectLayer('Spikes').objects.forEach((spike) => {
    // Add new spikes to our sprite group
    const spikeSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
    // By default the sprite has loads of whitespace from the base image, we
    // resize the sprite to reduce the amount of whitespace used by the sprite
    // so collisions can be more precise
    spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
  });

  // Add collision between the player and the spikes
  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
  this.add.text(BLOCK_SIZE+30, 10, 'LEVEL', {
    fontFamily: 'impact',
    fontSize: '24px',
    color: 'yellow'
  });
  this.add.text(BLOCK_SIZE*4+20, 10, 'SCORE', {
    fontFamily: 'impact',
    fontSize: '24px',
    color: 'yellow'
  });
  this.add.text(BLOCK_SIZE*7+20, 10, 'ENERGY', {
    fontFamily: 'impact',
    fontSize: '24px',
    color: 'yellow'
  });
  this.add.text(BLOCK_SIZE*12+20, 10, 'TIME', {
    fontFamily: 'impact',
    fontSize: '24px',
    color: 'yellow'
  });
  this.add.text(BLOCK_SIZE*14+20, 10, 'LIVES', {
    fontFamily: 'impact',
    fontSize: '24px',
    color: 'yellow'
  });
}

function update() {
  // Control the player with left or right keys
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
    this.player.setFlipX(true);
    this.player.play('walk', true);
  } 
  else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
    this.player.setFlipX(false);
    this.player.play('walk', true);
  }
  else if (this.cursors.up.isDown) {
    this.player.setVelocityY(-200);
    this.player.play('walk_up', true);
  } 
  else if (this.cursors.down.isDown) {
    this.player.setVelocityY(200);
    this.player.play('walk_down', true);
  } 
  else {
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.player.play('idle', true);
  }

}

/**
 * playerHit resets the player's state when it dies from colliding with a spike
 * @param {*} player - player sprite
 * @param {*} spike - spike player collided with
 */
function playerHit(player, spike) {
  // Set velocity back to 0
  player.setVelocity(0, 0);
  // Put the player back in its original position
  player.setX(50);
  player.setY(300);
  // Use the default `idle` animation
  player.play('idle', true);
  // Set the visibility to 0 i.e. hide the player
  player.setAlpha(0);
  // Add a tween that 'blinks' until the player is gradually visible
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: 'Linear',
    repeat: 5,
  });
}
