import { GAME_STATE } from "../config.js";

export class IntermissionScene extends Phaser.Scene {
    constructor() {
        super("IntermissionScene");

        this.glow1Grow = 0.05;
        this.glow2Grow = 0.01;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        const score = this.registry.get("score");
        const timeLeft = this.registry.get("timeLeft");

        this.registry.set("gameState", GAME_STATE.INTERMISSION);

        this.glow1 = this.add.image(width / 2, 80, "glow").setOrigin(0.5).setScale(0.75);
        this.glow2 = this.add.image(width / 2, 80, "glow").setOrigin(0.5).setAngle(90).setScale(0.75);
        this.splash = this.add.image(width / 2, 120, "splash").setOrigin(0.5).setScale(0.75);

        this.add.image(width / 2, height * 0.75, "level complete")
            .setOrigin(0.5)
            .setScale(1.5)
            .setInteractive()
            .on("pointerdown", () => this.nextLevel());

        this.add.text(width * 0.6, height * 0.8, String(score).padStart(4, "0"), {
            fontFamily: "Times New Roman",
            fontSize: "24px",
            color: "#ffff00"
        });

        this.add.text(width * 0.6, height * 0.745, String(timeLeft).padStart(4, "0"), {
            fontFamily: "Times New Roman",
            fontSize: "24px",
            color: "#ffff00"
        });

        this.keys = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    nextLevel() {
        this.registry.set("level", this.registry.get("level") + 1);
        this.registry.set("timeLeft", 34);
        this.scene.start("LevelIntroScene");
    }

    showGlowEffect() {
        const glowScale = 2;

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

    update() {
        this.showGlowEffect();

        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.nextLevel();
        }
    }
}