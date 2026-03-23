import {
  BLOCK_SIZE,
  SPRITE_SIZE,
  GAME_STATE,
  SPRITE_SCALE,
  BLOCK_TYPES,
} from "../config.js";
import { createAnimations } from "../AnimationFactory.js";
import { setUpIntro } from "../IntroSetup.js";
import { setUpLevelIntro } from "../LevelIntroSetup.js";
import { setUpLevel } from "../LevelSetup.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.gameState = GAME_STATE.INTRO;
    this.level = 6;
    this.score = 0;
    this.lives = 3;
    this.capsuleCount = 0;
    this.portalOpen = false;
    this.timerEvent = null;
    this.objectData = null;
    this.levelData = null;
    this.startTimeLeft = 34;
    this.timeLeft = 34;
    this.glow1Scale = 2.5;
    this.glow2Scale = 2.5;
    this.glow1Grow = 0.05;
    this.glow2Grow = 0.01;
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

    createAnimations(this);

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.startLevel();
  }

  startLevel() {

    switch (this.gameState) {
      case GAME_STATE.INTRO:
        setUpIntro(this);
        break;

      case GAME_STATE.LEVEL_INTRO:
        setUpLevelIntro(this);
        break;

      case GAME_STATE.LEVEL:
        setUpLevel(this);
        break;

      default:
        break;
    }
  }
  createTimer() {
    // remove old timer
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }

    // create repeating timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {

        if (this.gameState !== GAME_STATE.LEVEL) return;
        if (this.playerLevelWon.visible) return;
        this.timeLeft--;

        if (this.timeLeft <= 0) {
          this.timeLeft = 0;

          this.timerEvent.remove(false);
          this.timerEvent = null;

          console.log("TIME UP");
        }
      }
    });

  }

  registerArcadeColliders() {
    if (!this.player) return;

    this.physics.add.collider(this.player, this.blocks, this.handlePlayerVsBlock, null, this);
    this.physics.add.collider(this.player, this.capsules);
    this.physics.add.collider(this.player, this.rocks);
    this.physics.add.collider(this.player, this.explosives);
    this.physics.add.collider(this.mummies, this.blocks);
    this.physics.add.collider(this.capsules, this.door);

    this.physics.add.collider(this.capsules, this.blocks);
    this.physics.add.collider(this.capsules, this.rocks);

    this.physics.add.collider(this.rocks, this.blocks);
    this.physics.add.collider(this.explosives, this.blocks, this.handleExplosiveVsBlock, null, this);
    this.physics.add.collider(this.rocks, this.explosives, this.handleRockVsExplosive, null, this);
    this.physics.add.collider(this.locusts, this.blocks, this.handleLocustVsBlock, null, this);

    this.physics.add.collider(this.player, this.portal, this.handlePlayerVsPortal, null, this);
    this.physics.add.overlap(this.player, this.keySprite, this.handlePlayerVsKey, null, this);
    this.physics.add.overlap(this.portal, this.capsules, this.handleCapsuleVsPortal, null, this);
    this.physics.add.overlap(this.rocks, this.locusts, this.handleRockVsLocust, null, this);
  }

  handlePlayerVsBlock(player, block) {
    const frameName = block?.frame?.name;
    if (BLOCK_TYPES[frameName] === "sand") {
      block.destroy();
    }
  }

  handleExplosiveVsBlock(explosive, block) {
    if (!explosive?.body || !block?.active) return;

    const impactVelocity = explosive.prevVY ?? 0;

    if (impactVelocity > 120) { // ← tweak threshold here
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
    locust.speedX = -locust.speedX;
    locust.speedY = -locust.speedY;
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
    if (!capsule.active || !portal.active) return;

    console.log("capsule hitting portal");

    capsule.disableBody(true, true);
    this.capsuleCount--;

    if (this.capsuleCount <= 0) {
      this.capsuleCount = 0;
      this.openPortal();
    }
  }

  handlePlayerVsPortal(player, portal) {
    console.log('player hit portal');
    let distance = Math.abs(portal.x - player.x);

    if (!this.portalOpen || distance > 4) return;

    this.portalOpen = false;
    this.playerLevelWon.visible = true;
    this.playerLevelWon.setPosition(this.player.x, this.player.y);
    this.playerLevelWon.play("player_level_won", true);
    this.player.visible = false;
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
      this.playerLevelIntro.play("player_level_intro", true);
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
    this.playerLevelWon.visible = false;
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

    if (this.splash) this.splash.y = 150;
    if (this.glow1) this.glow1.y -= 40;
    if (this.glow2) this.glow2.y -= 40;

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
        if (!this.levelIntroBuilt)
          this.startLevel();
        break;

      case GAME_STATE.LEVEL:
        if (this.glow1) this.glow1.visible = false;
        if (this.glow2) this.glow2.visible = false;
        if (this.splash) this.splash.visible = false;
        if (this.playerLevelIntro) this.playerLevelIntro.visible = false;
        if (this.startButton) this.startButton.visible = false;
        if (this.levelComplete) this.levelComplete.visible = false;
        if (this.scoreText2) this.scoreText2.visible = false;
        if (this.timeLeftText2) this.timeLeftText2.visible = false;
        this.level++;
        this.startTimeLeft += 10;
        this.timeLeft = this.startTimeLeft;
        this.gameState = GAME_STATE.LEVEL;
        if (!this.levelBuilt)
          this.startLevel();
        else {
          this.levelData = this.objectData["level_" + this.level]?.[0];
          this.renderBlocks();
          this.spawnObjects();
          this.portalOpen = false;
          this.backgroundImage.visible = true;
          this.levelText.visible = true;
          this.livesText.visible = true;
          this.scoreText.visible = true;
          this.timeLeftText.visible = true;
          this.createTimer();
        }
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
        newRock.setDrag(20, 0);
        newRock.setMaxVelocity(120, 180);
      }
    });

    this.levelData.locust_position.forEach((locust) => {
      if (locust.x !== 0 && locust.y !== 0) {
        const x = locust.x * BLOCK_SIZE - SPRITE_SIZE;
        const y = locust.y * BLOCK_SIZE - SPRITE_SIZE;

        const newLocust = this.locusts.create(x, y, "locust")
          .setScale(SPRITE_SCALE)
          .setOrigin(0.5);

        newLocust.speedX = locust.xv * 60 || 0;
        newLocust.speedY = locust.yv * 60 || 0;

        newLocust.body.setAllowGravity(false);
        newLocust.body.setImmovable(false);
      }
    });

    this.levelData.explosive_position.forEach((bomb) => {
      if (bomb.x !== 0 && bomb.y !== 0) {
        const x = bomb.x * BLOCK_SIZE - SPRITE_SIZE;
        const y = bomb.y * BLOCK_SIZE - SPRITE_SIZE;

        const newExplosive = this.explosives.create(x, y, "explosive")
          .setScale(SPRITE_SCALE - 0.15)
          .setOrigin(0.5);

        newExplosive.setCollideWorldBounds(true);
        newExplosive.setBounce(0);
        newExplosive.setDrag(160, 0);
        newExplosive.setMaxVelocity(60, 240);
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
      newCapsule.body.setCircle(65);

      newCapsule.setDrag(20, 0);
      newCapsule.setMaxVelocity(120, 180);
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
  handleExplosives() {
    this.explosives.getChildren().forEach(explosive => {
      if (!explosive.body) return;

      explosive.prevVY = explosive.body.velocity.y;
    });

  }
  handleLocusts() {
    this.locusts?.getChildren().forEach((locust) => {
      if (!locust.body) return;
      locust.setVelocity(locust.speedX, locust.speedY);
    });
  }

  handleRockRoll() {
    this.rocks?.getChildren().forEach((rock) => {
      if (rock.body.velocity.x !== 0) {
        rock.angle += rock.body.velocity.x * 0.025;
      }
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
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
          this.gameState = GAME_STATE.LEVEL;
          this.startLevel();
        }
        break;

      case GAME_STATE.INTERMISSION:
        if (this.glow1 && this.glow2) {
          this.showGlowEffect();
        }
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.score++;
          this.updateStats();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
          this.gameState = GAME_STATE.LEVEL;
          this.bumpLevel();
        }
        break;

      case GAME_STATE.LEVEL:
        if (!this.player) return;
        this.handleExplosives();
        this.handlePlayerMovement();
        this.handleMummies();
        this.handleLocusts();
        this.handleRockRoll();
        this.updateStats();
        break;

      default:
        break;
    }
  }
}