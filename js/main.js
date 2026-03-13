import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";
import { GameScene } from "./GameScene.js";
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [GameScene]
};
new Phaser.Game(config);