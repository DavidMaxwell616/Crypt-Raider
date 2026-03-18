import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";
import { BootScene } from "./scenes/BootScene.js";
import { IntroScene } from "./scenes/IntroScene.js";
import { LevelIntroScene } from "./scenes/LevelIntroScene.js";
import { PlayScene } from "./scenes/PlayScene.js";
import { IntermissionScene } from "./scenes/IntermissionScene.js";

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: "game",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        BootScene,
        IntroScene,
        LevelIntroScene,
        PlayScene,
        IntermissionScene
    ]
};

new Phaser.Game(config);