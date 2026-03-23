import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";
import { BootScene } from "./scenes/BootScene.js";
import { GameScene } from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: "game",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [
        BootScene,
        GameScene,
    ]
};

new Phaser.Game(config);