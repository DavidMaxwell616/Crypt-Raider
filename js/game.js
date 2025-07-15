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
    default: "matter",
    matter: {
      gravity: { y: .5 },
      debug: true
    }
  },
};

let game_state = Game_State.INTRO;
const game = new Phaser.Game(config);
let _scene;

function create() {
  _scene = this;
  startLevel(this);
}

function startLevel(scene) {
  _scene.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
  switch (game_state) {
    case Game_State.INTRO:
      if (objectData == undefined)
        objectData = _scene.cache.json.get('levelData');
      blocks = _scene.add.group();
      glow1 = _scene.add.image(config.width / 2, config.height / 4, 'glow').setOrigin(0.5);
      glow2 = _scene.add.image(config.width / 2, config.height / 4, 'glow').setOrigin(0.5).setAngle(90);
      splash = _scene.add.image(config.width / 2, config.height / 2.7, 'splash').setOrigin(0.5).setScale(2.5);
      start_button = _scene.add.image(config.width / 2, config.height * .8, 'start button').setOrigin(0.5).setScale(2.5);
      start_button
        .setInteractive()
        .on('pointerdown', () => bumpLevel());
      break;
    case Game_State.LEVEL_INTRO:
      backgroundImage = _scene.add.image(0, 0, 'background').setOrigin(0);
      _scene.add.text(BLOCK_SIZE + 30, 10, 'LEVEL: ' + level, {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      _scene.add.text(BLOCK_SIZE * 4 + 20, 10, 'SCORE: ' + score, {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      _scene.add.text(BLOCK_SIZE * 7 + 20, 10, 'ENERGY', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      _scene.add.text(BLOCK_SIZE * 12 + 20, 10, 'TIME', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      _scene.add.text(BLOCK_SIZE * 14 + 20, 10, 'LIVES', {
        fontFamily: 'impact',
        fontSize: '24px',
        color: 'yellow'
      });
      get_ready = _scene.add.image(BLOCK_SIZE * 4.9, BLOCK_SIZE * 4, 'level intro').setOrigin(0).setScale(1.45, 1.7);

      levelText = _scene.add.text(BLOCK_SIZE * 6, BLOCK_SIZE * 6, 'LEVEL: ' + level, {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      levelCode = _scene.add.text(BLOCK_SIZE * 6, BLOCK_SIZE * 7, 'LEVEL CODE: ' + Level_Codes[0], {
        fontFamily: 'courier new',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      });
      start_button2 = _scene.add.sprite(BLOCK_SIZE * 7, BLOCK_SIZE * 8.1, 'capsule').setOrigin(0).setScale(2);
      start_button2
        .setInteractive()
        .on('pointerdown', () => { game_state = Game_State.LEVEL; startLevel(); });
      _scene.anims.create({
        key: 'capsule',
        frames: _scene.anims.generateFrameNumbers('capsule'),
        frameRate: 8,
        repeat: -1
      });
      startText = _scene.add.text(BLOCK_SIZE * 8.5, BLOCK_SIZE * 8.5, 'START', {
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
      player = _scene.matter.add.sprite(13 * BLOCK_SIZE, 3 * BLOCK_SIZE + 24, 'player')
        .setScale(1.4)
        .setOrigin(.5)
        .setDensity(5)
        .setFixedRotation(true)
        .setIgnoreGravity(true);
      player.body.label = 'player';
      capsule = _scene.matter.add.sprite(6 * BLOCK_SIZE, 3 * BLOCK_SIZE, 'capsule')
        .setScale(1.4)
        .setOrigin(0.5)
        .setBounce(0.4)
        .setCircle(25)
        .setDensity(.005)
        .setIgnoreGravity(false);
      capsule.body.label = 'capsule';
      portal_open = _scene.matter.add.sprite(9 * BLOCK_SIZE + BLOCK_SIZE / 2, 12 * BLOCK_SIZE + BLOCK_SIZE / 2 + 2, 'portal open')
        .setScale(1.72)
        .setOrigin(0.5)
        .setSensor(true)
        .setStatic(true);
      portal_open.body.label = 'portal open';
      _scene.anims.create({
        key: 'portal open',
        frames: _scene.anims.generateFrameNumbers('portal open'),
        frameRate: 8,
        repeat: -1
      });
      portal_open.visible = false;
      portal_open.play('portal open', true);
      portal = _scene.matter.add.sprite(9 * BLOCK_SIZE + BLOCK_SIZE / 2, 12 * BLOCK_SIZE + BLOCK_SIZE / 2 + 2, 'portal')
        .setScale(1.72)
        .setOrigin(0.5)
        .setStatic(true);
      portal.body.label = 'portal';
      _scene.anims.create({
        key: 'walk',
        frames: _scene.anims.generateFrameNumbers('player', { frames: [4, 5, 6] }),
        frameRate: 8,
        repeat: -1
      });

      player_level_won = _scene.matter.add.sprite(9 * BLOCK_SIZE + BLOCK_SIZE / 2, 11 * BLOCK_SIZE + BLOCK_SIZE / 2 + 2, 'player level won')
        .setScale(1.72)
        .setOrigin(0.5)
        .setSensor(true)
        .setStatic(true);
      player_level_won.body.label = 'player level won';
      _scene.anims.create({
        key: 'player level won',
        frames: _scene.anims.generateFrameNumbers('player level won'),
        frameRate: 8,
        repeat: 0
      });
      player_level_won.visible = false;
      player_level_won.on('animationcomplete', function (animation, frame) {
        if (animation.key === 'player level won') {
          clearLevel();
        }
      });

      player_level_intro = _scene.matter.add.sprite(game.config.width / 2, game.config.height / 2, 'player level intro')
        .setScale(1.72)
        .setOrigin(0.5)
        .setSensor(true)
        .setStatic(true);
      player_level_intro.body.label = 'player level intro';
      _scene.anims.create({
        key: 'player level intro',
        frames: _scene.anims.generateFrameNumbers('player level intro'),
        frameRate: 8,
        repeat: -1
      });
      player_level_intro.visible = false;

      _scene.anims.create({
        key: 'idle',
        frames: _scene.anims.generateFrameNumbers('player', { frames: [0] }),
        frameRate: 8,
        repeat: -1
      });

      _scene.anims.create({
        key: 'walk_down',
        frames: _scene.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3] }),
        frameRate: 8,
        repeat: -1
      });

      _scene.anims.create({
        key: 'walk_up',
        frames: _scene.anims.generateFrameNumbers('player', { frames: [8, 9, 10] }),
        frameRate: 8,
        repeat: -1
      });
      capsule.play('capsule', true);
      cursors = _scene.input.keyboard.createCursorKeys();
      renderBlocks();
      _scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
        if ((!portalOpen && bodyA.label == "capsule" && bodyB.label == "portal") || (bodyB.label == "portal" && bodyA.label == "capsule")) {
          openPortal();
        }
        if ((portalOpen && bodyA.label == "player" && bodyB.label == "portal") || (bodyB.label == "portal" && bodyA.label == "player")) {
          bumpLevel();
        }
      });
      break;
    default:
      break;
  }
}
function clearLevel() {
  player_level_intro.visible = true;
  player_level_intro.play('player level intro', true);
  blocks.children.each(block => {
    block.destroy();
    _scene.matter.world.remove(block);
  })
  portal_open.visible = false;
  portal.visible = false;
  splash.visible = glow1.visible = glow2.visible = true;
}

function renderBlocks() {
  var blockX = BLOCK_SIZE / 2;
  var blockY = BLOCK_SIZE + BLOCK_SIZE / 2;
  levelData.walls.forEach(block => {
    if (block > 0) {
      var element = _scene.matter.add.sprite(blockX, blockY, 'blocks')
        .setOrigin(.5)
        .setScale(.78125)
        .setFrame(block)
        .setStatic(true)
        .setIgnoreGravity(true);
      blocks.add(element);
    }
    blockX += BLOCK_SIZE;
    if (blockX > GAME_WIDTH - BLOCK_SIZE / 2) {
      blockX = BLOCK_SIZE / 2;
      blockY += BLOCK_SIZE;
    }
  });
}

function openPortal() {
  portalOpen = true;
  capsule.visible = false;
  capsule.body.destroy();
  portal_open.visible = true;
}
function bumpLevel() {
  switch (game_state) {
    case Game_State.INTRO:
      game_state = Game_State.LEVEL_INTRO;
      glow1.visible = glow2.visible =
        splash.visible = start_button.visible = false;
      startLevel();
      break;
    case Game_State.LEVEL:
      portalOpen = false;
      player_level_won.visible = true;
      player_level_won.play('player level won', true);
      player.visible = false;
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