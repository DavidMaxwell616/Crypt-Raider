export function createAnimations(scene) {
    const { anims } = scene;

    if (!anims.exists("capsule")) {
        anims.create({
            key: "capsule",
            frames: anims.generateFrameNumbers("capsule"),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!anims.exists("portal open")) {
        anims.create({
            key: "portal open",
            frames: anims.generateFrameNumbers("portal open"),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!anims.exists("explosion")) {
        anims.create({
            key: "explosion",
            frames: anims.generateFrameNumbers("explosion"),
            frameRate: 8,
            repeat: 0
        });
    }

    if (!anims.exists("walk")) {
        anims.create({
            key: "walk",
            frames: anims.generateFrameNumbers("player", { frames: [4, 5, 6] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!anims.exists("idle")) {
        anims.create({
            key: "idle",
            frames: anims.generateFrameNumbers("player", { frames: [0] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!anims.exists("walk_down")) {
        anims.create({
            key: "walk_down",
            frames: anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!anims.exists("walk_up")) {
        anims.create({
            key: "walk_up",
            frames: anims.generateFrameNumbers("player", { frames: [8, 9, 10] }),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!anims.exists("player level won")) {
        anims.create({
            key: "player level won",
            frames: anims.generateFrameNumbers("player level won"),
            frameRate: 8,
            repeat: 0
        });
    }

    if (!anims.exists("player_intro")) {
        anims.create({
            key: "player_intro",
            frames: anims.generateFrameNumbers("player_intro"),
            frameRate: 16,
            repeat: -1
        });
    }

    if (!anims.exists("door")) {
        anims.create({
            key: "door",
            frames: anims.generateFrameNumbers("door"),
            frameRate: 16,
            repeat: 0
        });
    }
}