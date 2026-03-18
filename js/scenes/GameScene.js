import {
  BLOCK_SIZE,
  SPRITE_SIZE,
  GAME_STATE,
  LEVEL_CODES,
  PLAYER_LEVEL_INTRO,
  PLAYER_LEVEL_WON,
  SPRITE_SCALE,
  BLOCK_TYPES,
  GAME_WIDTH,
  GAME_HEIGHT,
  YELLOW
} from "../config.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.gameState = GAME_STATE.INTRO;

    this.level = 1;
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 34;
    this.capsuleCount = 0;
    this.portalOpen = false;
    this.timerEvent = null;
    this.objectData = null;
    this.levelData = null;

    this.glow1Scale = 2.5;
    this.glow2Scale = 2.5;
    this.glow1Grow = 0.05;
    this.glow2Grow = 0.01;
  }

  preload() {
    this.load.image("splash", "assets/images/crypt raider title.svg");
    this.load.image("glow", "assets/images/glow.png");
    this.load.image("level intro", "assets/images/get ready.png");
    this.load.image("background", "assets/images/background.png");
    this.load.spritesheet("blocks", "assets/spritesheets/blocks.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image("start button", "assets/images/start button.png");
    this.load.image("level complete", "assets/images/level complete.png");
    this.load.image("portal", "assets/images/portal.png");
    this.load.spritesheet("door", "assets/spritesheets/door.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("rock", "assets/spritesheets/rock.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("locust", "assets/spritesheets/locust.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("mummy", "assets/spritesheets/mummy.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("portal open", "assets/spritesheets/portal open.png", {
      frameWidth: 64,
      frameHeight: 60
    });
    this.load.spritesheet("player level won", "assets/spritesheets/player level won.png", {
      frameWidth: 61,
      frameHeight: 85
    });
    this.load.spritesheet("player", "assets/spritesheets/player.png", {
      frameWidth: 27,
      frameHeight: 32
    });
    this.load.spritesheet("capsule", "assets/spritesheets/capsule.png", {
      frameWidth: 130,
      frameHeight: 130
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
      frameWidth: 98,
      frameHeight: 98
    });
    this.load.spritesheet("explosive", "assets/spritesheets/explosive.png", {
      frameWidth: 58,
      frameHeight: 32
    });
    this.load.spritesheet(PLAYER_LEVEL_INTRO, "assets/spritesheets/player_intro.png", {
      frameWidth: 87,
      frameHeight: 95
    });
    this.load.spritesheet("key", "assets/spritesheets/key.png", {
      frameWidth: 30,
      frameHeight: 27
    });

    this.load.path = "../assets/json/";
    this.load.json("levelData", "level_data.json");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.physics.world.setBounds(0, 0, width, height);

    this.blocks = this.physics.add.staticGroup();
    this.rocks = this.physics.add.group();
    this.locusts = this.physics.add.group();
    this.mummies = this.physics.add.group();
    this.capsules = this.physics.add.group();
    this.explosives = this.physics.add.group();

    this.objectData = this.cache.json.get("levelData");

    this.createAnimations();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.startLevel();
  }

  createAnimations() {
    if (!this.anims.exists("capsule")) {
      this.anims.create({
        key: "capsule",
        frames: this.anims.generateFrameNumbers("capsule"),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("portal open")) {
      this.anims.create({
        key: "portal open",
        frames: this.anims.generateFrameNumbers("portal open"),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("explosion")) {
      this.anims.create({
        key: "explosion",
        frames: this.anims.generateFrameNumbers("explosion"),
        frameRate: 8,
        repeat: 0
      });
    }

    if (!this.anims.exists("walk")) {
      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("player", { frames: [4, 5, 6] }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("idle")) {
      this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("player", { frames: [0] }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("walk_down")) {
      this.anims.create({
        key: "walk_down",
        frames: this.anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3] }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("walk_up")) {
      this.anims.create({
        key: "walk_up",
        frames: this.anims.generateFrameNumbers("player", { frames: [8, 9, 10] }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists(PLAYER_LEVEL_WON)) {
      this.anims.create({
        key: PLAYER_LEVEL_WON,
        frames: this.anims.generateFrameNumbers(PLAYER_LEVEL_WON),
        frameRate: 8,
        repeat: 0
      });
    }

    if (!this.anims.exists(PLAYER_LEVEL_INTRO)) {
      this.anims.create({
        key: PLAYER_LEVEL_INTRO,
        frames: this.anims.generateFrameNumbers(PLAYER_LEVEL_INTRO),
        frameRate: 16,
        repeat: -1
      });
    }

    if (!this.anims.exists("door")) {
      this.anims.create({
        key: "door",
        frames: this.anims.generateFrameNumbers("door"),
        frameRate: 16,
        repeat: 0
      });
    }
  }

  startLevel() {
    const width = this.scale.width;
    const height = this.scale.height;

    switch (this.gameState) {
      case GAME_STATE.INTRO:
        this.blocks.clear(true, true);

        this.glow1 = this.add.image(width / 2, height / 4, "glow").setOrigin(0.5);
        this.glow2 = this.add.image(width / 2, height / 4, "glow").setOrigin(0.5).setAngle(90);
        this.splash = this.add.image(width / 2, height / 2.7, "splash").setOrigin(0.5).setScale(2.5);

        this.startButton = this.add.image(width / 2, height * 0.8, "start button")
          .setOrigin(0.5)
          .setScale(2.5)
          .setInteractive()
          .on("pointerdown", () => this.bumpLevel());

        this.levelComplete = this.add.image(width / 2, height * 0.75, "level complete")
          .setOrigin(0.5)
          .setScale(1.5)
          .setInteractive()
          .on("pointerdown", () => {
            this.gameState = GAME_STATE.LEVEL;
            this.bumpLevel();
          });

        this.levelComplete.visible = false;
        break;

      case GAME_STATE.LEVEL_INTRO:
        this.backgroundImage = this.add.image(0, 0, "background").setOrigin(0);

        this.levelText = this.add.text(BLOCK_SIZE + 30, 10, "LEVEL: " + this.level, {
          fontFamily: "impact",
          fontSize: "24px",
          color: YELLOW
        });

        this.scoreText = this.add.text(BLOCK_SIZE * 4 + 20, 10, "SCORE: " + this.score, {
          fontFamily: "impact",
          fontSize: "24px",
          color: YELLOW
        });

        this.scoreText2 = this.add.text(GAME_WIDTH * .6, GAME_HEIGHT * .8, {
          fontFamily: "Times New Roman",
          fontSize: "24px",
          color: YELLOW
        });

        this.livesText = this.add.text(BLOCK_SIZE * 7 + 20, 10, "LIVES: " + this.lives, {
          fontFamily: "impact",
          fontSize: "24px",
          color: YELLOW
        });

        this.timeLeftText = this.add.text(BLOCK_SIZE * 10 + 20, 10, "TIME: " + this.timeLeft, {
          fontFamily: "impact",
          fontSize: "24px",
          color: YELLOW
        });
        this.timeLeftText2 = this.add.text(GAME_WIDTH * .6, GAME_HEIGHT * .745, this.timeLeft,
          {
            fontFamily: "Times New Roman",
            fontSize: "24px",
            color: YELLOW
          });
        this.getReady = this.add.image(BLOCK_SIZE * 4.9, BLOCK_SIZE * 4, "level intro")
          .setOrigin(0)
          .setScale(1.45, 1.7);

        this.levelCode = this.add.text(
          BLOCK_SIZE * 6,
          BLOCK_SIZE * 7,
          "LEVEL CODE: " + (LEVEL_CODES[this.level] || LEVEL_CODES[0]),
          {
            fontFamily: "courier new",
            fontSize: "24px",
            fontWeight: "bold",
            color: "white"
          }
        );

        this.startButton2 = this.add.sprite(BLOCK_SIZE * 7, BLOCK_SIZE * 8.1, "capsule")
          .setOrigin(0)
          .setScale(0.4)
          .setInteractive()
          .on("pointerdown", () => {
            this.gameState = GAME_STATE.LEVEL;
            this.startLevel();
          });

        this.startButton2.play("capsule", true);

        this.startText = this.add.text(BLOCK_SIZE * 8.5, BLOCK_SIZE * 8.5, "START", {
          fontFamily: "courier new",
          fontSize: "24px",
          fontWeight: "bold",
          color: "white"
        });
        break;

      case GAME_STATE.LEVEL:
        this.cleanupLevelObjects();

        if (this.getReady) this.getReady.visible = false;
        if (this.levelText) this.levelText.visible = false;
        if (this.levelCode) this.levelCode.visible = false;
        if (this.startButton2) this.startButton2.visible = false;
        if (this.startText) this.startText.visible = false;

        this.levelData = this.objectData["level_" + this.level]?.[0];
        if (!this.levelData) {
          console.warn("Missing level data for level", this.level);
          return;
        }

        this.player = this.physics.add.sprite(0, 0, "player")
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5)
          .setCollideWorldBounds(true);

        this.player.body.setAllowGravity(false);

        this.portalOpenSprite = this.add.sprite(0, 0, "portal open")
          .setScale(1.72)
          .setOrigin(0.5);
        this.portalOpenSprite.visible = false;
        this.portalOpenSprite.play("portal open", true);

        this.keySprite = this.physics.add.sprite(0, 0, "key")
          .setScale(1.72)
          .setOrigin(0.5)
          .setImmovable(true);

        this.keySprite.body.setAllowGravity(false);
        this.keySprite.visible = false;
        this.keySprite.label = "key";

        this.explosion = this.add.sprite(0, 0, "explosion")
          .setScale(1.72)
          .setOrigin(0.5);
        this.explosion.visible = false;

        this.portal = this.physics.add.sprite(0, 0, "portal")
          .setOrigin(0.5)
          .setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
          .setImmovable(true);

        this.portal.body.setAllowGravity(false);
        this.portal.label = "portal";

        this.playerLevelWon = this.add.sprite(0, 0, PLAYER_LEVEL_WON)
          .setScale(1.3)
          .setOrigin(0.5);
        this.playerLevelWon.visible = false;
        this.timeLeftText2.visible = false;
        this.scoreText2.visible = false;
        this.playerLevelWon.off("animationcomplete");
        this.playerLevelWon.on("animationcomplete", (animation) => {
          if (animation.key === PLAYER_LEVEL_WON) {
            this.clearLevel();
          }
        });

        this.playerLevelIntro = this.add.sprite(width / 2, height / 2, PLAYER_LEVEL_INTRO)
          .setScale(1.72)
          .setOrigin(0.5);
        this.playerLevelIntro.visible = false;

        this.renderBlocks();
        this.spawnObjects();
        this.portalOpen = false;
        this.registerArcadeColliders();
        break;

      default:
        break;
    }

    // reset time if needed
    this.timeLeft = 34;

    // kill any previous timer (important!)
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }

    // create repeating timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        // only count down during active gameplay
        if (this.gameState !== GAME_STATE.LEVEL) return;

        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.updateStats();
        }

        if (this.timeLeft <= 0) {
          this.timeLeft = 0;

          // stop timer
          this.timerEvent.remove(false);
          this.timerEvent = null;

          console.log("TIME UP");

          // example behavior:
          // this.lives--;
          // this.gameState = GAME_STATE.LEVEL_INTRO;
          // this.startLevel();
        }
      }
    });
  }

  registerArcadeColliders() {
    if (!this.player) return;

    // solid collisions
    this.physics.add.collider(this.player, this.blocks, this.handlePlayerVsBlock, null, this);
    this.physics.add.collider(this.player, this.capsules);
    this.physics.add.collider(this.player, this.rocks);
    this.physics.add.collider(this.player, this.door);
    this.physics.add.overlap(this.player, this.portal, this.handlePlayerVsPortal, null, this);
    this.physics.add.collider(this.player, this.portal);

    this.physics.add.collider(this.capsules, this.blocks);
    this.physics.add.collider(this.capsules, this.rocks);

    this.physics.add.collider(this.rocks, this.blocks);
    this.physics.add.collider(this.explosives, this.blocks, this.handleExplosiveVsBlock, null, this);
    this.physics.add.collider(this.rocks, this.explosives, this.handleRockVsExplosive, null, this);
    this.physics.add.collider(this.locusts, this.blocks, this.handleLocustVsBlock, null, this);

    // trigger overlaps
    this.physics.add.overlap(this.player, this.keySprite, this.handlePlayerVsKey, null, this);
    this.physics.add.overlap(this.capsules, this.portal, this.handleCapsuleVsPortal, null, this);
    this.physics.add.overlap(this.rocks, this.locusts, this.handleRockVsLocust, null, this);
  }

  handlePlayerVsBlock(player, block) {
    const frameName = block?.frame?.name;
    if (BLOCK_TYPES[frameName] === "sand") {
      block.destroy();
    }
  }

  handleExplosiveVsBlock(explosive, block) {
    if (!explosive.body || !block) return;
    if (explosive.body.velocity.y > 3) {
      this.explodeBodies(explosive, block);
    }
  }

  handleRockVsExplosive(rock, explosive) {
    if (!rock.body || !explosive.body) return;
    if (rock.body.velocity.y > 3 || explosive.body.velocity.y > 3) {
      this.explodeBodies(rock, explosive);
    }
  }

  handleLocustVsBlock(locust) {
    if (!locust.body) return;
    if (locust.body.velocity.y !== 0) {
      locust.setVelocityY(-locust.body.velocity.y);
    }
    if (locust.body.velocity.x > 0) {
      locust.setVelocityX(-locust.body.velocity.x);
    }
  }

  handlePlayerVsKey(player, key) {
    if (!key.active) return;
    key.visible = false;
    key.destroy();

    if (this.door) {
      this.door.play("door", true);
    }
  }

  handleCapsuleVsPortal(portal, capsule) {
    let distance = Math.abs(portal.x - capsule.x);
    if (!this.portalOpen && distance > 4) return;

    capsule.visible = false;
    capsule.destroy();
    this.capsuleCount--;

    if (this.capsuleCount <= 0) {
      this.openPortal();
    }
  }

  handlePlayerVsPortal(player, portal) {
    let distance = Math.abs(portal.x - player.x);

    if (!this.portalOpen || distance > 4) return;

    this.portalOpen = false;
    this.playerLevelWon.visible = true;
    this.playerLevelWon.setPosition(this.player.x, this.player.y);
    this.playerLevelWon.play(PLAYER_LEVEL_WON, true);
    this.player.visible = false;
    this.player.body.enable = false;
  }

  handleRockVsLocust(rock, locust) {
    if (!rock.active || !locust.active) return;

    this.explosion.setPosition(rock.x, rock.y);
    rock.destroy();
    locust.destroy();

    this.explosion.visible = true;
    this.showExplosion();
    this.explosion.play("explosion", true);
  }

  explodeBodies(obj1, obj2) {
    this.explosion.setPosition(obj1.x, obj1.y);

    if (obj1?.active) {
      obj1.visible = false;
      obj1.destroy();
    }

    if (obj2?.active) {
      obj2.visible = false;
      obj2.destroy();
    }

    this.explosion.visible = true;
    this.showExplosion();
    this.explosion.play("explosion", true);
  }

  showExplosion() {
    const exp = this.explosion;

    this.blocks.getChildren().forEach((block) => {
      if (
        parseInt(block.frame.name, 10) < 6 &&
        block.x > exp.x - exp.width &&
        block.x < exp.x + exp.width &&
        block.y > exp.y - exp.height &&
        block.y < exp.y + exp.height
      ) {
        block.destroy();
      }
    });
  }

  clearLevel() {
    this.capsuleCount = 0;

    if (this.playerLevelIntro) {
      this.playerLevelIntro.visible = true;
      this.playerLevelIntro.play(PLAYER_LEVEL_INTRO, true);
    }

    this.blocks.clear(true, true);
    this.rocks.clear(true, true);
    this.mummies.clear(true, true);
    this.locusts.clear(true, true);
    this.capsules.clear(true, true);
    this.explosives.clear(true, true);

    this.scoreText.visible = false;
    this.scoreText2.visible = true;
    this.timeLeftText.visible = false;
    this.timeLeftText2.visible = true;
    this.livesText.visible = false;
    this.levelText.visible = false;

    if (this.portal) this.portal.visible = false;
    if (this.backgroundImage) this.backgroundImage.visible = false;
    if (this.portalOpenSprite) this.portalOpenSprite.visible = false;

    if (this.splash) this.splash.visible = true;
    if (this.glow1) this.glow1.visible = true;
    if (this.glow2) this.glow2.visible = true;
    if (this.levelComplete) this.levelComplete.visible = true;

    if (this.glow1) this.glow1.setScale(0.75);
    if (this.glow2) this.glow2.setScale(0.75);
    if (this.splash) this.splash.setScale(0.75);

    if (this.splash) this.splash.y = 120;
    if (this.glow1) this.glow1.y = 80;
    if (this.glow2) this.glow2.y = 80;

    this.gameState = GAME_STATE.INTERMISSION;
  }

  updateStats() {

    this.levelText.setText("LEVEL: " + this.level);
    this.scoreText.setText("SCORE: " + this.score);
    this.scoreText2.setText(this.padZeros(this.score, 4));
    this.livesText.setText("LIVES: " + this.lives);
    this.timeLeftText.setText("TIME: " + this.timeLeft);
    this.timeLeftText2.setText(this.padZeros(this.timeLeft, 4));
  }

  padZeros = (num, targetLength) => String(num).padStart(targetLength, '0');

  renderBlocks() {
    if (!this.levelData?.walls) return;

    let blockX = BLOCK_SIZE / 2;
    let blockY = BLOCK_SIZE + BLOCK_SIZE / 2;
    const gameWidth = this.scale.width;

    this.blocks.clear(true, true);

    this.levelData.walls.forEach((block) => {
      if (block > 0) {
        const sprite = this.blocks.create(blockX, blockY, "blocks")
          .setOrigin(0.5)
          .setScale(0.78125)
          .setFrame(block);

        sprite.refreshBody();
        sprite.label = "Rectangle Body";
      }

      blockX += BLOCK_SIZE;
      if (blockX > gameWidth - BLOCK_SIZE / 2) {
        blockX = BLOCK_SIZE / 2;
        blockY += BLOCK_SIZE;
      }
    });
  }

  openPortal() {
    this.portalOpen = true;
    if (this.portalOpenSprite) {
      this.portalOpenSprite.visible = true;
    }
  }

  bumpLevel() {
    switch (this.gameState) {
      case GAME_STATE.INTRO:
        this.gameState = GAME_STATE.LEVEL_INTRO;

        if (this.glow1) this.glow1.visible = false;
        if (this.glow2) this.glow2.visible = false;
        if (this.splash) this.splash.visible = false;
        if (this.startButton) this.startButton.visible = false;
        this.startLevel();
        break;

      case GAME_STATE.LEVEL:
        if (this.glow1) this.glow1.visible = false;
        if (this.glow2) this.glow2.visible = false;
        if (this.splash) this.splash.visible = false;
        if (this.startButton) this.startButton.visible = false;
        if (this.levelComplete) this.levelComplete.visible = false;
        this.level++;
        this.gameState = GAME_STATE.LEVEL;
        this.startLevel();
        break;

      case GAME_STATE.INTERMISSION:
        break;

      default:
        break;
    }
  }

  spawnObjects() {
    if (!this.levelData) return;

    this.capsuleCount = 0;

    const playerX = this.levelData.player_position.x * BLOCK_SIZE - SPRITE_SIZE;
    const playerY = this.levelData.player_position.y * BLOCK_SIZE - SPRITE_SIZE;
    this.player.setPosition(playerX, playerY);
    this.player.setVelocity(0, 0);

    const portalX = this.levelData.portal_position.x * BLOCK_SIZE - SPRITE_SIZE;
    const portalY = this.levelData.portal_position.y * BLOCK_SIZE - SPRITE_SIZE;
    this.portal.setPosition(portalX, portalY);
    this.portalOpenSprite.setPosition(portalX, portalY);

    const keyX = this.levelData.key_position.x * BLOCK_SIZE - SPRITE_SIZE;
    const keyY = this.levelData.key_position.y * BLOCK_SIZE - SPRITE_SIZE;
    this.keySprite.setPosition(keyX, keyY).setVisible(true);

    this.playerLevelWon.setPosition(0, 0);

    this.levelData.rock_position.forEach((rock) => {
      if (rock.x !== 0 && rock.y !== 0) {
        const x = rock.x * BLOCK_SIZE - SPRITE_SIZE;
        const y = rock.y * BLOCK_SIZE - SPRITE_SIZE;

        const newRock = this.rocks.create(x, y, "rock")
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5);
        newRock.body.setCircle(16);
        newRock.setDrag(10, 0);
        newRock.setMaxVelocity(120, 240);
      }
    });

    this.levelData.locust_position.forEach((locust) => {
      if (locust.x !== 0 && locust.y !== 0) {
        const x = locust.x * BLOCK_SIZE - SPRITE_SIZE;
        const y = locust.y * BLOCK_SIZE - SPRITE_SIZE;

        const newLocust = this.locusts.create(x, y, "locust")
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5);

        newLocust.body.setAllowGravity(false);
        newLocust.body.setImmovable(false);
        newLocust.setVelocity(0, 40);
      }
    });

    this.levelData.explosive_position.forEach((bomb) => {
      if (bomb.x !== 0 && bomb.y !== 0) {
        const x = bomb.x * BLOCK_SIZE - SPRITE_SIZE;
        const y = bomb.y * BLOCK_SIZE - SPRITE_SIZE;

        const tnt = this.explosives.create(x, y, "explosive")
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5);

      }
    });

    this.levelData.mummy_position.forEach((mummy) => {
      if (mummy.x !== 0 && mummy.y !== 0) {
        const x = mummy.x * BLOCK_SIZE - SPRITE_SIZE;
        const y = mummy.y * BLOCK_SIZE - SPRITE_SIZE;

        const newMummy = this.mummies.create(x, y, "mummy")
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5);

        newMummy.body.setAllowGravity(false);
        newMummy.speedX = 0;
        newMummy.speedY = 0;
      }
    });

    if (this.levelData.door_position.x !== 0 && this.levelData.door_position.y !== 0) {
      const x = this.levelData.door_position.x * BLOCK_SIZE - SPRITE_SIZE;
      const y = this.levelData.door_position.y * BLOCK_SIZE - SPRITE_SIZE;

      this.door = this.physics.add.staticSprite(x, y, "door")
        .setScale(SPRITE_SCALE)
        .setOrigin(0.5);

      this.door.refreshBody();

      this.door.off("animationcomplete");
      this.door.on("animationcomplete", () => {
        this.door.destroy();
        this.door = null;
      });
    }

    this.levelData.capsule_position.forEach((capsule) => {
      const x = capsule.x * BLOCK_SIZE - SPRITE_SIZE;
      const y = capsule.y * BLOCK_SIZE - SPRITE_SIZE;

      const newCapsule = this.capsules.create(x, y, "capsule")
        .setScale(0.34)
        .setOrigin(0.5);

      newCapsule.body.setAllowGravity(true);
      newCapsule.body.setCollideWorldBounds(true);

      // smaller collision body so it doesn't snag on corners
      newCapsule.body.setCircle(65);

      newCapsule.setDrag(10, 0);
      newCapsule.setMaxVelocity(120, 240);
      newCapsule.play("capsule", true);
      newCapsule.anims.setCurrentFrame(
        this.anims.get("capsule").frames[Phaser.Math.Between(1, 5)]
      );

      this.capsuleCount++;
    });
    this.player.visible = true;
    this.portal.visible = true;
    this.portal.depth = 1;
  }

  cleanupLevelObjects() {
    const groups = [
      this.blocks,
      this.rocks,
      this.locusts,
      this.mummies,
      this.capsules,
      this.explosives
    ];

    groups.forEach((group) => {
      group?.clear(true, true);
    });

    const sprites = [
      "player",
      "portal",
      "portalOpenSprite",
      "keySprite",
      "explosion",
      "door",
      "playerLevelWon",
      "playerLevelIntro"
    ];

    sprites.forEach((key) => {
      if (this[key]) {
        this[key].destroy();
        this[key] = null;
      }
    });
  }

  showGlowEffect() {
    const glowScale = this.gameState === GAME_STATE.INTRO ? 5 : 2;
    if (this.glow1.scale < 0.5 || this.glow1.scale > glowScale) {
      this.glow1Grow *= -1;
    }

    if (this.glow2.scale < 0.5 || this.glow2.scale > glowScale) {
      this.glow2Grow *= -1;
    }
    this.glow1.scale += this.glow1Grow;
    this.glow2.scale += this.glow2Grow;
    this.glow1.angle++;
    this.glow2.angle++;
  }

  handlePlayerMovement() {
    if (!this.player) return;

    const speed = 180;
    let vx = 0;
    let vy = 0;

    if (this.keys.left.isDown) {
      vx = -speed;
      this.player.setFlipX(true);
      this.player.play("walk", true);
    } else if (this.keys.right.isDown) {
      vx = speed;
      this.player.setFlipX(false);
      this.player.play("walk", true);
    } else if (this.keys.up.isDown) {
      vy = -speed;
      this.player.play("walk_up", true);
    } else if (this.keys.down.isDown) {
      vy = speed;
      this.player.play("walk_down", true);
    } else {
      this.player.play("idle", true);
    }

    this.player.setVelocity(vx, vy);
  }

  handleMummies() {
    this.mummies?.getChildren().forEach((mummy) => {
      if (!mummy.body || !this.player) return;

      if (this.player.x < mummy.x) {
        mummy.speedX = -30;
      } else if (this.player.x > mummy.x) {
        mummy.speedX = 30;
      } else {
        mummy.speedX = 0;
      }

      if (this.player.y < mummy.y) {
        mummy.speedY = -30;
      } else if (this.player.y > mummy.y) {
        mummy.speedY = 30;
      } else {
        mummy.speedY = 0;
      }

      mummy.setVelocity(mummy.speedX, mummy.speedY);
    });
  }

  update(delta) {
    switch (this.gameState) {
      case GAME_STATE.INTRO:
        if (this.glow1 && this.glow2) {
          this.showGlowEffect();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
          this.bumpLevel();
        }
        break;
      case GAME_STATE.LEVEL_INTRO:
        if (this.level > 1 && this.timeLeft > 0) {
          this.timeLeft--;
          this.score++;
        }
        else {
          if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.gameState = GAME_STATE.LEVEL;
            this.startLevel();
          };
        }
        break;
      case GAME_STATE.INTERMISSION:
        if (this.glow1 && this.glow2) {
          this.showGlowEffect();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
          this.gameState = GAME_STATE.LEVEL;
          this.bumpLevel();
        };
        break;

      case GAME_STATE.LEVEL:
        if (!this.player) return;

        this.handlePlayerMovement();
        this.handleMummies();

        this.timeAccumulator += delta;

        while (this.timeAccumulator >= 1000) {
          this.timeAccumulator -= 1000;

          if (this.timeLeft > 0) {
            this.timeLeft--;
          }

          if (this.timeLeft <= 0) {
            this.timeLeft = 0;

            // timeout behavior
            // this.lives--;
            // this.gameState = GAME_STATE.LEVEL_INTRO;
            // this.startLevel();

            break;
          }
        }

        this.updateStats();
        break;

      default:
        break;
    }
  }
}