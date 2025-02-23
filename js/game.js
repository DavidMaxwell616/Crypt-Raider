const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 900,
  height: 600,
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
let game_state = Game_State.INTRO;
const game = new Phaser.Game(config);

function create() {
  startLevel(this);
}

function startLevel(scene)
{
  switch (game_state) {
    case Game_State.INTRO:
      scene.cursors = scene.input.keyboard.createCursorKeys();
      glow1 = scene.add.image(config.width/2, config.height/4, 'glow').setOrigin(0.5);
      glow2 = scene.add.image(config.width/2, config.height/4, 'glow').setOrigin(0.5).setAngle(90);
      splash = scene.add.image(config.width/2, config.height/2.7, 'splash').setOrigin(0.5).setScale(2.5);
      start_button = scene.add.image(config.width/2, config.height*.8, 'start button').setOrigin(0.5).setScale(2.5);
      start_button
      .setInteractive()
      .on('pointerdown', () => bumpLevel(scene) );      break;
    case Game_State.LEVEL_INTRO:
      backgroundImage = scene.add.image(0, 0, 'background').setOrigin(0);
      scene.add.text(BLOCK_SIZE+30, 10, 'LEVEL: '+level, {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE*4+20, 10, 'SCORE: '+score, {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE*7+20, 10, 'ENERGY', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE*12+20, 10, 'TIME', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE*14+20, 10, 'LIVES', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      var map = scene.make.tilemap({ key: 'map'});
       // When loading from an array, make sure to specify the tileWidth and tileHeight
      //const map = scene.make.tilemap({ data: map, tileWidth: 32, tileHeight:32 });
      var tileset = map.addTilesetImage('blocks', 'tiles');
      const layer = map.createLayer('level1', tileset, 0,BLOCK_SIZE);     
     console.log(layer);
       get_ready = scene.add.image(config.width/2, config.height/1.5, 'level intro').setOrigin(0.5).setScale(1.5);;
     
      scene.add.text(config.width*.3,  BLOCK_SIZE*7.3, 'LEVEL: '+level, {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      scene.add.text(config.width*.3,  BLOCK_SIZE*8.3, 'LEVEL CODE: '+Level_Codes[0], {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      scene.start_button2 = scene.add.sprite(config.width/2.5, config.height*.8, 'capsule').setOrigin(0.5).setScale(2.5);
      scene.start_button2
      .setInteractive()
      .on('pointerdown', () => bumpLevel(scene) );      
      scene.anims.create({
        key: 'capsule',
        frames: scene.anims.generateFrameNumbers('capsule'),
        frameRate: 8,
        repeat: -1
      });
        scene.add.text(config.width/2, BLOCK_SIZE*9, 'START', {
        fontFamily: 'courier new',
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'white'
      });     
     scene.start_button2.play('capsule', true);
      break;

    case Game_State.LEVEL:
    //var level = platforms.tilemap.layers[0];
    // There are many ways to set collision between tiles and players
    // As we want players to collide with all of the platforms, we tell Phaser to
    // set collisions for every tile in our platform layer whose index isn't -1.
    // Tiled indices can only be >= 0, therefore we are colliding with all of
    // the platform layer
    platforms.setCollisionByExclusion(-1, true);
  
    // Add the player to the game world
    scene.player = scene.physics.add.sprite(13*BLOCK_SIZE, 3*BLOCK_SIZE-5,'player').setScale(1.6).setOrigin(0);;
    scene.player.setBounce(0.1); // our player will bounce from items
    scene.player.setCollideWorldBounds(true); // don't go out of the map
    scene.physics.add.collider(scene.player, platforms);
   
    scene.capsule = scene.physics.add.sprite(6*BLOCK_SIZE, 3*BLOCK_SIZE,'capsule').setScale(1.25).setOrigin(0);;
    scene.capsule.setCollideWorldBounds(true); // don't go out of the map
    scene.capsule.setGravityY(1500);
    scene.capsule.setBounce(.2);
    scene.physics.add.collider(scene.capsule, platforms);
    scene.physics.add.collider(scene.capsule, scene.player);
    scene.portal = scene.physics.add.sprite(9*BLOCK_SIZE, 12*BLOCK_SIZE,'portal').setScale(1.75).setOrigin(0);;
    scene.physics.add.collider(scene.capsule, scene.portal, levelUp, null, scene);
   
    scene.anims.create({
      key: 'walk',
      frames: scene.anims.generateFrameNumbers('player', { frames: [ 4, 5, 6 ] }),
      frameRate: 8,
      repeat: -1
    });
  
    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNumbers('player', { frames: [ 0 ] }),
      frameRate: 8,
      repeat: -1
    });
  
    scene.anims.create({
      key: 'walk_down',
      frames: scene.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 3 ] }),
      frameRate: 8,
      repeat: -1
    });
  
    scene.anims.create({
      key: 'walk_up',
      frames: scene.anims.generateFrameNumbers('player', { frames: [ 8, 9, 10 ] }),
      frameRate: 8,
      repeat: -1
    });
    scene.capsule.play('capsule', true);
    // Enable user input via cursor keys
    scene.cursors = scene.input.keyboard.createCursorKeys();
  
    // Create a sprite group for all spikes, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    scene.spikes = scene.physics.add.group({
      allowGravity: false,
      immovable: true
    });
  
    // // Get the spikes from the object layer of our Tiled map. Phaser has a
    // // createFromObjects function to do so, but it creates sprites automatically
    // // for us. We want to manipulate the sprites a bit before we use them
    map.getObjectLayer('Spikes').objects.forEach((spike) => {
      // Add new spikes to our sprite group
      const spikeSprite = scene.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
    //   // By default the sprite has loads of whitespace from the base image, we
    //   // resize the sprite to reduce the amount of whitespace used by the sprite
    //   // so collisions can be more precise
      spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
    });
  
    // // Add collision between the player and the spikes
     scene.physics.add.collider(scene.player, scene.spikes, playerHit, null, scene);
  
    
  
    default:
      break;
  }
}
function bumpLevel(scene)
{
switch (game_state) {
  case Game_State.INTRO:
    game_state = Game_State.LEVEL_INTRO; 
    glow1.visible = glow2.visible = 
    splash.visible = start_button.visible = false; 
    startLevel(scene);
    break;
  default:
    break;
}
}
function update() {
  switch (game_state) {
    case Game_State.INTRO:
      if(glow1.scale<0 || glow1.scale>3)
      {
        glow1_grow*=-1;
      }
      if(glow2.scale<0 || glow2.scale>3)
        {
          glow2_grow*=-1;
        }
    glow1.scale += glow1_grow;
    glow2.scale += glow2_grow;
    glow1.angle++;
    glow2.angle++; 
      break;
    case Game_State.LEVEL:
    // Control the player with left or right keys
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.setVelocityY(0);
      this.player.setFlipX(true);
      this.player.play('walk', true);
    } 
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.setVelocityY(0);
      this.player.setFlipX(false);
      this.player.play('walk', true);
    }
    else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
      this.player.setVelocityX(0);
      this.player.play('walk_up', true);
    } 
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
      this.player.setVelocityX(0);
      this.player.play('walk_down', true);
    } 
    else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.play('idle', true);
    };
    
    default:
      break;
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

function levelUp(){
  this.capsule.visible = false;
  console.log('level up!!!');
}