const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 10,
      },
      debug: true,
    },
  },
};
let game_state = Game_State.INTRO;
const game = new Phaser.Game(config);

function create() {
  startLevel(this);
}

function startLevel(scene) {
  scene.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
  switch (game_state) {
    case Game_State.INTRO:
      if (objectData == undefined)
        objectData = scene.cache.json.get('levelData');
      blocks = scene.add.group();
      glow1 = scene.add.image(config.width / 2, config.height / 4, 'glow').setOrigin(0.5);
      glow2 = scene.add.image(config.width / 2, config.height / 4, 'glow').setOrigin(0.5).setAngle(90);
      splash = scene.add.image(config.width / 2, config.height / 2.7, 'splash').setOrigin(0.5).setScale(2.5);
      start_button = scene.add.image(config.width / 2, config.height * .8, 'start button').setOrigin(0.5).setScale(2.5);
      start_button
        .setInteractive()
        .on('pointerdown', () => bumpLevel(scene));
      break;
    case Game_State.LEVEL_INTRO:
      backgroundImage = scene.add.image(0, 0, 'background').setOrigin(0);
      scene.add.text(BLOCK_SIZE + 30, 10, 'LEVEL: ' + level, {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE * 4 + 20, 10, 'SCORE: ' + score, {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE * 7 + 20, 10, 'ENERGY', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE * 12 + 20, 10, 'TIME', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      scene.add.text(BLOCK_SIZE * 14 + 20, 10, 'LIVES', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      get_ready = scene.add.image(BLOCK_SIZE * 4.9, BLOCK_SIZE * 4, 'level intro').setOrigin(0).setScale(1.45, 1.7);

      levelText = scene.add.text(BLOCK_SIZE * 6, BLOCK_SIZE * 6, 'LEVEL: ' + level, {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      levelCode = scene.add.text(BLOCK_SIZE * 6, BLOCK_SIZE * 7, 'LEVEL CODE: ' + Level_Codes[0], {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      start_button2 = scene.add.sprite(BLOCK_SIZE * 7, BLOCK_SIZE * 8.1, 'capsule').setOrigin(0).setScale(2);
      start_button2
        .setInteractive()
        .on('pointerdown', () => { game_state = Game_State.LEVEL; startLevel(scene); });
      scene.anims.create({
        key: 'capsule',
        frames: scene.anims.generateFrameNumbers('capsule'),
        frameRate: 8,
        repeat: -1
      });
      startText = scene.add.text(BLOCK_SIZE * 8.5, BLOCK_SIZE * 8.5, 'START', {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      start_button2.play('capsule', true);
      break;

    case Game_State.LEVEL:
      get_ready.visible = levelText.visible =
        levelCode.visible = start_button2.visible =
        startText.visible = false;
      levelData = objectData['level_' + level][0];
      player = scene.matter.add.sprite(13 * BLOCK_SIZE, 3 * BLOCK_SIZE + 24, 'player')
        .setScale(1.4)
        .setOrigin(.5)
        .setIgnoreGravity(true);
      capsule = scene.matter.add.sprite(6 * BLOCK_SIZE, 3 * BLOCK_SIZE, 'capsule')
        .setScale(1.25)
        .setOrigin(0.5);
      portal = scene.matter.add.sprite(9 * BLOCK_SIZE, 12 * BLOCK_SIZE, 'portal')
        .setScale(1.75)
        .setOrigin(0.5)
        .setStatic(true);

      scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers('player', { frames: [4, 5, 6] }),
        frameRate: 8,
        repeat: -1
      });

      scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('player', { frames: [0] }),
        frameRate: 8,
        repeat: -1
      });

      scene.anims.create({
        key: 'walk_down',
        frames: scene.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3] }),
        frameRate: 8,
        repeat: -1
      });

      scene.anims.create({
        key: 'walk_up',
        frames: scene.anims.generateFrameNumbers('player', { frames: [8, 9, 10] }),
        frameRate: 8,
        repeat: -1
      });
      capsule.play('capsule', true);
      cursors = scene.input.keyboard.createCursorKeys();
      renderBlocks(scene);
      break;
    default:
      break;
  }
}
function renderBlocks(scene) {
  var blockX = 0;
  var blockY = BLOCK_SIZE;
  levelData.walls.forEach(block => {
    if (block > 0) {
      var element = scene.add.sprite(blockX, blockY, 'blocks').setOrigin(0).setFrame(block);
      blocks.add(element);
    }
    blockX += BLOCK_SIZE;
    if (blockX > GAME_WIDTH - BLOCK_SIZE) {
      blockX = 0;
      blockY += BLOCK_SIZE;
    }
    console.log(blockX);
  });
}


function bumpLevel(scene) {
  switch (game_state) {
    case Game_State.INTRO:
      game_state = Game_State.LEVEL_INTRO;
      glow1.visible = glow2.visible =
        splash.visible = start_button.visible = false;
      startLevel(scene);
      break;
    case Game_State.LEVEL:
      capsule.visible = false;
      game_state = Game_State.LEVEL_INTRO;
      console.log('contact');
      // startLevel(scene);
      break;
    default:
      break;
  }
}
function update() {
  switch (game_state) {
    case Game_State.INTRO:
      if (glow1.scale < 0 || glow1.scale > 3) {
        glow1_grow *= -1;
      }
      if (glow2.scale < 0 || glow2.scale > 3) {
        glow2_grow *= -1;
      }
      glow1.scale += glow1_grow;
      glow2.scale += glow2_grow;
      glow1.angle++;
      glow2.angle++;
      break;
    case Game_State.LEVEL:
      if (cursors.left.isDown) {
        player.x += -1;
        player.y += 0;
        player.setFlipX(true);
        player.play('walk', true);
      }
      else if (cursors.right.isDown) {
        player.x += 1;
        player.y += 0;
        player.setFlipX(false);
        player.play('walk', true);
      }
      else if (cursors.up.isDown) {
        player.x += 0;
        player.y -= 1;
        player.play('walk_up', true);
      }
      else if (cursors.down.isDown) {
        player.x += 0;
        player.y += 1;
        player.play('walk_down', true);
      }
      else {
        player.x += 0;
        player.y += 0;
        player.play('idle', true);
      };

    default:
      break;
  }
}

function levelUp() {
  capsule.visible = false;
  console.log('level up!!!');
}