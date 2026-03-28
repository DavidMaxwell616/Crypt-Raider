import {
    YELLOW,
    BLOCK_SIZE,
    LEVEL_CODES,
    GAME_WIDTH,
    GAME_HEIGHT,
    GAME_STATE,
} from "./config.js";

export function setUpLevelIntro(scene) {
    scene.backgroundImage = scene.add.image(0, 0, "background").setOrigin(0);

    scene.levelText = scene.add.text(BLOCK_SIZE + 30, 10, "LEVEL: " + scene.level, {
        fontFamily: "impact",
        fontSize: "24px",
        color: YELLOW
    });

    scene.scoreText = scene.add.text(BLOCK_SIZE * 4 + 20, 10, "SCORE: " + scene.score, {
        fontFamily: "impact",
        fontSize: "24px",
        color: YELLOW
    });

    scene.scoreText2 = scene.add.text(GAME_WIDTH * .6, GAME_HEIGHT * .8, scene.score, {
        fontFamily: "Times New Roman",
        fontSize: "24px",
        color: YELLOW
    });
    scene.scoreText2.visible = false;

    scene.livesText = scene.add.text(BLOCK_SIZE * 7 + 20, 10, "LIVES: " + scene.lives, {
        fontFamily: "impact",
        fontSize: "24px",
        color: YELLOW
    });

    scene.timeLeftText = scene.add.text(BLOCK_SIZE * 10 + 20, 10, "TIME: " + scene.timeLeft, {
        fontFamily: "impact",
        fontSize: "24px",
        color: YELLOW
    });
    scene.timeLeftText2 = scene.add.text(GAME_WIDTH * .6, GAME_HEIGHT * .745, scene.timeLeft,
        {
            fontFamily: "Times New Roman",
            fontSize: "24px",
            color: YELLOW
        });
    scene.timeLeftText2.visible = false;

    scene.getReady = scene.add.image(BLOCK_SIZE * 4.9, BLOCK_SIZE * 4, "level intro")
        .setOrigin(0)
        .setScale(1.45, 1.7);

    scene.levelCode = scene.add.text(
        BLOCK_SIZE * 6,
        BLOCK_SIZE * 7,
        "LEVEL CODE: " + (LEVEL_CODES[scene.level] || LEVEL_CODES[0]),
        {
            fontFamily: "courier new",
            fontSize: "24px",
            fontWeight: "bold",
            color: "white"
        }
    );

    scene.startButton2 = scene.add.sprite(BLOCK_SIZE * 7, BLOCK_SIZE * 8.1, "capsule")
        .setOrigin(0)
        .setScale(0.4)
        .setInteractive()
        .on("pointerdown", () => {
            scene.gameState = GAME_STATE.LEVEL;
            scene.startLevel();
        });

    scene.startButton2.play("capsule", true);

    scene.startText = scene.add.text(BLOCK_SIZE * 8.5, BLOCK_SIZE * 8.5, "START", {
        fontFamily: "courier new",
        fontSize: "24px",
        fontWeight: "bold",
        color: "white"
    });
    scene.levelIntroBuilt = true;
}