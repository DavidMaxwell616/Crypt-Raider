import {
  BLOCK_SIZE,
  SPRITE_SCALE,
} from "./config.js";

export function setUpLevel(scene) {
  scene.sfx.theme.stop();
  scene.cleanupLevelObjects();
  const width = scene.scale.width;
  const height = scene.scale.height;

  if (scene.getReady) scene.getReady.visible = false;
  if (scene.levelCode) scene.levelCode.visible = false;
  if (scene.startButton2) scene.startButton2.visible = false;
  if (scene.startText) scene.startText.visible = false;

  scene.levelData = scene.objectData["level_" + scene.level]?.[0];
  if (!scene.levelData) {
    console.warn("Missing level data for level", scene.level);
    return;
  }

  scene.player = scene.physics.add.sprite(0, 0, "player")
    .setScale(SPRITE_SCALE)
    .setOrigin(0.5)
    .setCollideWorldBounds(true);

  scene.player.body.setAllowGravity(false);

  scene.portalOpenSprite = scene.add.sprite(0, 0, "portal open")
    .setScale(1.72)
    .setOrigin(0.5);
  scene.portalOpenSprite.visible = false;
  scene.portalOpenSprite.play("portal open", true);

  scene.keySprite = scene.physics.add.sprite(0, 0, "key")
    .setScale(1.72)
    .setOrigin(0.5)
    .setImmovable(true);

  scene.keySprite.body.setAllowGravity(false);
  scene.keySprite.visible = false;
  scene.keySprite.label = "key";
  // reset timer
  scene.timeLeft = 34;
  scene.createTimer();
  scene.explosion = scene.add.sprite(0, 0, "explosion")
    .setScale(1.72)
    .setOrigin(0.5);
  scene.explosion.visible = false;

  scene.portal = scene.physics.add.sprite(0, 0, "portal")
    .setOrigin(0.5)
    .setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    .setImmovable(true);

  scene.portal.body.setAllowGravity(false);
  scene.portal.label = "portal";

  scene.playerLevelWon = scene.add.sprite(0, 0, "player_won")
    .setScale(1.3)
    .setOrigin(0.5);
  scene.playerLevelWon.visible = false;

  scene.playerDied = scene.add.sprite(0, 0, "player_died")
    .setScale(1.3)
    .setOrigin(0.5);
  scene.playerDied.visible = false;

  scene.timeLeftText2.visible = false;
  scene.scoreText2.visible = false;
  scene.playerLevelWon.off("animationcomplete");
  scene.playerLevelWon.on("animationcomplete", (animation) => {
    if (animation.key === "player_won") {
      scene.clearLevel();
    }
  });

  scene.playerLevelIntro = scene.add.sprite(width / 2, height / 2, "player_intro")
    .setScale(1.72)
    .setOrigin(0.5);
  scene.playerLevelIntro.visible = false;

  scene.renderBlocks();
  scene.spawnObjects();
  scene.portalOpen = false;
  scene.registerArcadeColliders();
  scene.levelBuilt = true;
}