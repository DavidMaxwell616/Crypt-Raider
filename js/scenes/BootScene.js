import {
    GAME_STATE
} from "../config.js";
import { createAnimations } from "../AnimationFactory.js";

export class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("splash", "assets/images/crypt raider title.svg");
        this.load.image("glow", "assets/images/glow.png");
        this.load.image("level intro", "assets/images/get ready.png");
        this.load.image("background", "assets/images/background.png");
        this.load.spritesheet("blocks", "assets/spritesheets/blocks.png", {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.image("start button", "assets/images/start button.png");
        this.load.image("level complete", "assets/images/level complete.png");
        this.load.image("portal", "assets/images/portal.png");
        this.load.image("rock", "assets/images/rock.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image("locust", "assets/images/locust.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image("explosive", "assets/images/explosive.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("mummy", "assets/spritesheets/mummy.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("door", "assets/spritesheets/door.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("portal open", "assets/spritesheets/portal open.png", {
            frameWidth: 64,
            frameHeight: 60
        });
        this.load.spritesheet("player", "assets/spritesheets/player.png", {
            frameWidth: 27,
            frameHeight: 32
        });
        this.load.spritesheet("player_won", "assets/spritesheets/player won.png", {
            frameWidth: 132,
            frameHeight: 131
        });
        this.load.spritesheet("player_died", "assets/spritesheets/player died.png", {
            frameWidth: 61,
            frameHeight: 85
        });
        this.load.spritesheet("capsule", "assets/spritesheets/capsule.png", {
            frameWidth: 130,
            frameHeight: 130
        });
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
            frameWidth: 98,
            frameHeight: 98
        });

        this.load.spritesheet("player_level_intro", "assets/spritesheets/player_intro.png", {
            frameWidth: 87,
            frameHeight: 95
        });
        this.load.spritesheet("key", "assets/spritesheets/key.png", {
            frameWidth: 30,
            frameHeight: 27
        });

        this.load.path = "../assets/json/";
        this.load.json("levelData", "level_data.json");
        // placeholder sounds (replace with real files later)
        this.load.path = "../assets/sfx/";
        this.load.audio("sfx_explosion", "explosion.mp3");
        this.load.audio("sfx_player_died", "player_died.mp3");
        this.load.audio("sfx_pickup", "pickup.mp3");
        this.load.audio("sfx_capsule_drop", "capsule_drop.mp3");
        this.load.audio("sfx_level_won", "level_won.mp3");
        this.load.audio("sfx_tick", "tick.mp3");
        this.load.audio("sfx_walk", "walk.mp3");
        this.load.audio("sfx_walk_sand", "walk_sand.mp3");
        this.load.audio("sfx_theme", "theme.mp3")
    }

    create() {

        this.registry.set("gameState", GAME_STATE.INTRO);
        this.registry.set("score", 0);
        this.registry.set("lives", 3);
        this.registry.set("timeLeft", 34);
        this.registry.set("portalOpen", false);

        this.scene.start("GameScene");
    }
}