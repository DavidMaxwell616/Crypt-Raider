import {
    BLOCK_SIZE,
    LEVEL_CODES,
    GAME_STATE,
    GAME_WIDTH,
    GAME_HEIGHT,
    YELLOW
} from "../config.js";

export class LevelIntroScene extends Phaser.Scene {
    constructor() {
        super("LevelIntroScene");
    }

    create() {
        const level = this.registry.get("level");
        const score = this.registry.get("score");
        const lives = this.registry.get("lives");
        const timeLeft = 34;

        this.registry.set("gameState", GAME_STATE.LEVEL_INTRO);
        this.registry.set("timeLeft", timeLeft);

        this.add.image(0, 0, "background").setOrigin(0);

        this.add.text(BLOCK_SIZE + 30, 10, "LEVEL: " + level, {
            fontFamily: "impact",
            fontSize: "24px",
            color: YELLOW
        });

        this.add.text(BLOCK_SIZE * 4 + 20, 10, "SCORE: " + score, {
            fontFamily: "impact",
            fontSize: "24px",
            color: YELLOW
        });

        this.add.text(BLOCK_SIZE * 7 + 20, 10, "LIVES: " + lives, {
            fontFamily: "impact",
            fontSize: "24px",
            color: YELLOW
        });

        this.add.text(BLOCK_SIZE * 10 + 20, 10, "TIME: " + timeLeft, {
            fontFamily: "impact",
            fontSize: "24px",
            color: YELLOW
        });

        this.add.text(GAME_WIDTH * 0.6, GAME_HEIGHT * 0.745, String(timeLeft).padStart(4, "0"), {
            fontFamily: "Times New Roman",
            fontSize: "24px",
            color: YELLOW
        });

        this.add.image(BLOCK_SIZE * 4.9, BLOCK_SIZE * 4, "level intro")
            .setOrigin(0)
            .setScale(1.45, 1.7);

        this.add.text(
            BLOCK_SIZE * 6,
            BLOCK_SIZE * 7,
            "LEVEL CODE: " + (LEVEL_CODES[level] || LEVEL_CODES[0]),
            {
                fontFamily: "courier new",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white"
            }
        );

        const startButton = this.add.sprite(BLOCK_SIZE * 7, BLOCK_SIZE * 8.1, "capsule")
            .setOrigin(0)
            .setScale(0.4)
            .setInteractive()
            .on("pointerdown", () => this.scene.start("PlayScene"));

        startButton.play("capsule", true);

        this.add.text(BLOCK_SIZE * 8.5, BLOCK_SIZE * 8.5, "START", {
            fontFamily: "courier new",
            fontSize: "24px",
            fontWeight: "bold",
            color: "white"
        });

        this.keys = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.scene.start("PlayScene");
        }
    }
}