var cursors;
var pickups;
var player;
var layer;
var tiles;
var map;
var player_intro;
var gameStart = false;
var title;
var radiance;
var radiance2;
var start_button;
var wall_blocks;
class Game extends Phaser.Scene {
    constructor() {
      super();
    }
  
    
    preload ()
    {
        this.load.setPath('assets/maps');
        this.load.tilemapTiledJSON('map', 'platformer-simple.json');
        this.load.setPath('assets/spritesheets');
        this.load.spritesheet('player', 'player.png', { frameWidth: 32, frameHeight: 42 });
        this.load.spritesheet('player_intro', 'player_intro.png', { frameWidth: 89, frameHeight: 97 });
        this.load.spritesheet('radiance', 'radiance.png', { frameWidth: 443, frameHeight: 44});
        this.load.spritesheet('radiance2', 'radiance.png', { frameWidth: 443, frameHeight: 44});
        this.load.setPath('assets/images');
        this.load.image('title', 'crypt raider title.png');
        this.load.image('start_button', 'start button.png');
        this.load.setPath('assets/tilemaps/tiles');
        this.load.image('wall_blocks',  'wall_blocks.png');
        
        this.load.image('background', 'assets/images/background.png');
        this.load.image('tiles', 'assets/tilesets/blocks.png');
        this.load.image('spike', 'assets/images/spike.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
        this.load.spritesheet('player', 'assets/images/player.png', 
          { frameWidth: 34, frameHeight: 34 });
          
        // this.load.image('box', 'box-item-boxed.png');
        
        // this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');
        // this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/simple-map.json');
        // this.load.image('player', 'assets/images/phaser-dude.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const backgroundImage = this.add.image(0, 0, 'background');
        backgroundImage.setScale(1.5).setOrigin(0);
        const platforms = map.createLayer('Platforms', tileset, 0, 200);
        // There are many ways to set collision between tiles and players
        // As we want players to collide with all of the platforms, we tell Phaser to
        // set collisions for every tile in our platform layer whose index isn't -1.
        // Tiled indices can only be >= 0, therefore we are colliding with all of
        // the platform layer
        platforms.setCollisionByExclusion(-1, true);
      
        // Add the player to the game world
        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setBounce(0.1); // our player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map
        this.physics.add.collider(this.player, platforms);
      
        // Create the walking animation using the last 2 frames of
        // the atlas' first row
        // this.anims.create({
        //   key: 'walk',
        //   frames: this.anims.generateFrameNames('player', {
        //     prefix: 'robo_player_',
        //     start: 2,
        //     end: 3,
        //   }),
        //   frameRate: 10,
        //   repeat: -1
        // });
      
        // // Create an idle animation i.e the first frame
        // this.anims.create({
        //   key: 'idle',
        //   frames: [{ key: 'player', frame: 'robo_player_0' }],
        //   frameRate: 10,
        // });
      
        // // Use the second frame of the atlas for jumping
        // this.anims.create({
        //   key: 'jump',
        //   frames: [{ key: 'player', frame: 'robo_player_1' }],
        //   frameRate: 10,
        // });
      
        // Enable user input via cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
      
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
      }
      
    update() {
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-200);
          if (this.player.body.onFloor()) {
            this.player.play('walk', true);
          }
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(200);
          if (this.player.body.onFloor()) {
            this.player.play('walk', true);
          }
        } else {
          // If no keys are pressed, the player keeps still
          this.player.setVelocityX(0);
          // Only show the idle animation if the player is footed
          // If this is not included, the player would look idle while jumping
          if (this.player.body.onFloor()) {
            this.player.play('idle', true);
          }
        }
      
        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
          this.player.setVelocityY(-350);
          this.player.play('jump', true);
        }
      
        // If the player is moving to the right, keep them facing forward
        if (this.player.body.velocity.x > 0) {
          this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
          // otherwise, make them face the other side
          this.player.setFlipX(true);
        }
      }
      
      /**
       * playerHit resets the player's state when it dies from colliding with a spike
       * @param {*} player - player sprite
       * @param {*} spike - spike player collided with
       */
        playerHit(player, spike) {
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

// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     parent: 'phaser-example',
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 600 }
//         }
//     },
//     scene: Game
// };
config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 832,
    heigth: 640,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Game,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
      },
    }
  };


game = new Phaser.Game(config);

}
