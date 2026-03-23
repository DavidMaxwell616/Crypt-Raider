export function setUpIntro(scene) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    scene.blocks.clear(true, true);

    scene.glow1 = scene.add.image(width / 2, height / 4, "glow").setOrigin(0.5);
    scene.glow2 = scene.add.image(width / 2, height / 4, "glow").setOrigin(0.5).setAngle(90);
    scene.splash = scene.add.image(width / 2, height / 2.7, "splash").setOrigin(0.5).setScale(2.5);

    scene.startButton = scene.add.image(width / 2, height * 0.8, "start button")
        .setOrigin(0.5)
        .setScale(2.5)
        .setInteractive()
        .on("pointerdown", () => scene.bumpLevel());

    scene.levelComplete = scene.add.image(width / 2, height * 0.75, "level complete")
        .setOrigin(0.5)
        .setScale(1.5)
        .setInteractive()
        .on("pointerdown", () => {
            scene.gameState = GAME_STATE.LEVEL;
            scene.bumpLevel();
        });

    scene.levelComplete.visible = false;
}
