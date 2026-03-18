import {
    BLOCK_SIZE,
    SPRITE_SIZE,
    SPRITE_SCALE,
    BLOCK_TYPES,
    GAME_STATE,
    YELLOW
} from "../config.js";

export class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");

        this.timerEvent = null;
        this.capsuleCount = 0;
        this.portalOpen = false;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.registry.set("gameState", GAME_STATE.LEVEL);
        this.registry.set("timeLeft", 34);
        this.portalOpen = false;
        this.capsuleCount = 0;

        this.physics.world.setBounds(0, 0, width, height);

        this.objectData = this.cache.json.get("levelData");
        this.level = this.registry.get("level");
        this.score = this.registry.get("score");
        this.lives = this.registry.get("lives");
        this.timeLeft = this.registry.get("timeLeft");

        this.levelData = this.objectData["level_" + this.level]?.[0];
        if (!this.levelData) {
            console.warn("Missing level data for level", this.level);
            return;
        }

        this.blocks = this.physics.add.staticGroup();
        this.rocks = this.physics.add.group();
        this.locusts = this.physics.add.group();
        this.mummies = this.physics.add.group();
        this.capsules = this.physics.add.group();
        this.explosives = this.physics.add.group();

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.createHud();
        this.createWorldObjects();
        this.renderBlocks();
        this.spawnObjects();
        this.registerArcadeColliders();
        this.createLevelTimer();
    }

    createHud() {
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
    }

    createWorldObjects() {
        this.player = this.physics.add.sprite(0, 0, "player")
            .setScale(SPRITE_SCALE)
            .setOrigin(0.5)
            .setCollideWorldBounds(true);

        this.player.body.setAllowGravity(false);

        this.portalOpenSprite = this.add.sprite(0, 0, "portal open")
            .setScale(1.72)
            .setOrigin(0.5)
            .setVisible(false);

        this.portalOpenSprite.play("portal open", true);

        this.keySprite = this.physics.add.sprite(0, 0, "key")
            .setScale(1.72)
            .setOrigin(0.5)
            .setImmovable(true)
            .setVisible(false);

        this.keySprite.body.setAllowGravity(false);
        this.keySprite.label = "key";

        this.explosion = this.add.sprite(0, 0, "explosion")
            .setScale(1.72)
            .setOrigin(0.5)
            .setVisible(false);

        this.portal = this.physics.add.sprite(0, 0, "portal")
            .setOrigin(0.5)
            .setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
            .setImmovable(true);

        this.portal.body.setAllowGravity(false);
        this.portal.label = "portal";

        this.playerLevelWon = this.add.sprite(0, 0, "player level won")
            .setScale(1.3)
            .setOrigin(0.5)
            .setVisible(false);

        this.playerLevelWon.off("animationcomplete");
        this.playerLevelWon.on("animationcomplete", (animation) => {
            if (animation.key === "player level won") {
                this.winLevel();
            }
        });

        this.playerLevelIntro = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "player_intro")
            .setScale(1.72)
            .setOrigin(0.5)
            .setVisible(false);
    }

    createLevelTimer() {
        if (this.timerEvent) {
            this.timerEvent.remove(false);
        }

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.registry.set("timeLeft", this.timeLeft);
                    this.updateStats();
                }

                if (this.timeLeft <= 0) {
                    this.timeLeft = 0;
                    this.registry.set("timeLeft", 0);
                    this.updateStats();

                    this.timerEvent.remove(false);
                    this.timerEvent = null;

                    // timeout behavior hook
                }
            }
        });
    }

    updateStats() {
        this.levelText.setText("LEVEL: " + this.level);
        this.scoreText.setText("SCORE: " + this.score);
        this.livesText.setText("LIVES: " + this.lives);
        this.timeLeftText.setText("TIME: " + this.timeLeft);
    }

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

    spawnObjects() {
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

                this.explosives.create(x, y, "explosive")
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

    registerArcadeColliders() {
        this.physics.add.collider(this.player, this.blocks, this.handlePlayerVsBlock, null, this);
        this.physics.add.collider(this.player, this.capsules);
        this.physics.add.collider(this.player, this.rocks);
        if (this.door) this.physics.add.collider(this.player, this.door);
        this.physics.add.overlap(this.player, this.portal, this.handlePlayerVsPortal, null, this);
        this.physics.add.collider(this.player, this.portal);

        this.physics.add.collider(this.capsules, this.blocks);
        this.physics.add.collider(this.capsules, this.rocks);

        this.physics.add.collider(this.rocks, this.blocks);
        this.physics.add.collider(this.explosives, this.blocks, this.handleExplosiveVsBlock, null, this);
        this.physics.add.collider(this.rocks, this.explosives, this.handleRockVsExplosive, null, this);
        this.physics.add.collider(this.locusts, this.blocks, this.handleLocustVsBlock, null, this);

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

    handleCapsuleVsPortal(capsule, portal) {
        const distance = Math.abs(portal.x - capsule.x);
        if (!this.portalOpen && distance > 4) return;

        capsule.visible = false;
        capsule.destroy();
        this.capsuleCount--;

        if (this.capsuleCount <= 0) {
            this.openPortal();
        }
    }

    handlePlayerVsPortal(player, portal) {
        const distance = Math.abs(portal.x - player.x);
        if (!this.portalOpen || distance > 4) return;

        this.portalOpen = false;
        this.playerLevelWon.visible = true;
        this.playerLevelWon.setPosition(this.player.x, this.player.y);
        this.playerLevelWon.play("player level won", true);
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

    openPortal() {
        this.portalOpen = true;
        this.registry.set("portalOpen", true);

        if (this.portalOpenSprite) {
            this.portalOpenSprite.visible = true;
        }
    }

    winLevel() {
        this.registry.set("score", this.score);
        this.registry.set("lives", this.lives);
        this.registry.set("timeLeft", this.timeLeft);

        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        this.scene.start("IntermissionScene");
    }

    handlePlayerMovement() {
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

    update() {
        if (!this.player) return;

        this.handlePlayerMovement();
        this.handleMummies();
    }
}