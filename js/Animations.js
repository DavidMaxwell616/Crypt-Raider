import { PLAYER_LEVEL_INTRO, PLAYER_LEVEL_WON } from "./config.js";

export function createAnimations(scene) {
    if (!scene.anims.exists("capsule")) {
        scene.anims.create({
            key: "capsule",
            frames: scene.anims.generateFrameNumbers("capsule"),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists("portal open")) {
        scene.anims.create({
            key: "portal open",
            frames: scene.anims.generateFrameNumbers("portal open"),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists("explosion")) {
        scene.anims.create({
            key: "explosion",
            frames: scene.anims.generateFrameNumbers("explosion"),
            frameRate: 8,
            repeat: 0
        });
    }

    if (!scene.anims.exists("walk")) {
        scene.anims.create({
            key: "walk",
            frames: scene.anims.generateFrameNumbers("player", { frames: [4, 5, 6] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists("idle")) {
        scene.anims.create({
            key: "idle",
            frames: scene.anims.generateFrameNumbers("player", { frames: [0] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists("walk_down")) {
        scene.anims.create({
            key: "walk_down",
            frames: scene.anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists("walk_up")) {
        scene.anims.create({
            key: "walk_up",
            frames: scene.anims.generateFrameNumbers("player", { frames: [8, 9, 10] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists(PLAYER_LEVEL_WON)) {
        scene.anims.create({
            key: PLAYER_LEVEL_WON,
            frames: scene.anims.generateFrameNumbers(PLAYER_LEVEL_WON),
            frameRate: 8,
            repeat: 0
        });
    }

    if (!scene.anims.exists(PLAYER_LEVEL_INTRO)) {
        scene.anims.create({
            key: PLAYER_LEVEL_INTRO,
            frames: scene.anims.generateFrameNumbers(PLAYER_LEVEL_INTRO),
            frameRate: 16,
            repeat: -1
        });
    }

    if (!scene.anims.exists("door")) {
        scene.anims.create({
            key: "door",
            frames: scene.anims.generateFrameNumbers("door"),
            frameRate: 16,
            repeat: 0
        });
    }
}