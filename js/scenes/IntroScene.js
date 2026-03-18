import { GAME_STATE } from "../config.js";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");

        this.glow1Scale = 2.5;
        this.glow2Scale = 2.5;
        this.glow1Grow = 0.05;
        this.glow2Grow = 0.01;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.registry.set("gameState", GAME_STATE.INTRO);

        this.glow1 = this.add.image(width / 2, height / 4, "glow").setOrigin(0.5);
        this.glow2 = this.add.image(width / 2, height / 4, "glow").setOrigin(0.5).setAngle(90);
        this.splash = this.add.image(width / 2, height / 2.7, "splash").setOrigin(0.5).setScale(2.5);

        this.startButton = this.add.image(width / 2, height * 0.8, "start button")
            .setOrigin(0.5)
            .setScale(2.5)
            .setInteractive()
            .on("pointerdown", () => this.goNext());

        this.keys = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    goNext() {
        this.scene.start("LevelIntroScene");
    }

    showGlowEffect() {
        const glowScale = 5;

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
            this.goNext();
        }
    }
}