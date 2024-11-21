var cursors;
var pickups;
var player;
var layer;
var tiles;
var map;
var player_intro;
var gameStart = false;

class Game extends Phaser.Scene {
    constructor() {
      super();
    }
  
    
    preload ()
    {
        this.load.tilemapTiledJSON('map', 'assets/maps/platformer-simple.json');
        this.load.image('wall_map', 'assets/spritesheets/wall_blocks.png');
        this.load.spritesheet('player', 'assets/spritesheets/player.png', { frameWidth: 32, frameHeight: 42 });
        this.load.spritesheet('player_intro', 'assets/spritesheets/player_intro.png', { frameWidth: 89, frameHeight: 97 });
       // this.load.image('box', 'box-item-boxed.png');
        
        // this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');
        // this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/simple-map.json');
        // this.load.image('player', 'assets/images/phaser-dude.png');
    }

    create ()
    {
        if(!gameStart)
        {
            this.anims.create({
                key: 'player_intro',
                frames: this.anims.generateFrameNumbers('player_intro', { frames: [ 0, 1, 2, 3 ] }),
                frameRate: 8,
                repeat: -1
            }),
        player_intro = this.add.sprite(this.game.config.width/2, 170,'player_intro');
        player_intro.setScale(3);
        player_intro.play('player_intro');
        }
        return;
        
        this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
       // this.tileset = this.map.addTilesetImage('tiles');
        //this.layer = this.map.createLayer('Level1', this.tileset);
        tiles = this.map.addTilesetImage('tiles');
        layer = this.map.createLayer(0, tiles, 0, 0);
        this.map.setCollision([ 20, 48 ]);
        pickups = this.map.filterTiles(tile => tile.index === 82);
        player = this.add.rectangle(96, 96, 24, 38, 0xffff00);
        
        this.physics.add.existing(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.up.on('down', () =>
        {
            if (this.player.body.blocked.down)
            {
                this.player.body.setVelocityY(-360);
            }
        }, this);
        this.info = this.add.text(10, 10, 'Player');
    }

    update ()
    {
        return;
        this.player.body.setVelocityX(0);
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(200);
        }

        //  Collide player against the tilemap layer
        this.physics.collide(this.player, this.layer);

        //  Custom tile overlap check
        this.physics.world.overlapTiles(this.player, this.pickups, this.hitPickup, null, this);

        //  Debug info
        const blocked = this.player.body.blocked;

        this.info.setText(`left: ${blocked.left} right: ${blocked.right} down: ${blocked.down}`);
    }

    hitPickup (player, tile)
    {
        this.map.removeTile(tile, 29, false);
        this.pickups = this.map.filterTiles(tile => tile.index === 82);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }
        }
    },
    scene: Game
};

const game = new Phaser.Game(config);
