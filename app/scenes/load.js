export class LoadScene extends Phaser.Scene {

    constructor() {
        super({key: 'load'});
    }

    init() {
        console.log('load');
    }

    
    preload() {

        this.load.tilemapTiledJSON('map', 'assets/maps/map.json');

        this.load.image('tiles', 'assets/img/tileset.png');
        this.load.spritesheet('dude', 'assets/img/dude.png', { frameWidth: 26, frameHeight: 39 });
        this.load.spritesheet('dudeone', 'assets/img/dude1.png', { frameWidth: 26, frameHeight: 39 });
        this.load.spritesheet('dudetwo', 'assets/img/dude2.png', { frameWidth: 26, frameHeight: 39 });
        this.load.spritesheet('dudethree', 'assets/img/dude3.png', { frameWidth: 26, frameHeight: 39 });
        this.load.spritesheet('bomb', 'assets/img/bomb.png', { frameWidth: 28, frameHeight: 28 });

        // explosion
        this.load.spritesheet('explosion_center', 'assets/img/explosion_center.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion_horizontal', 'assets/img/explosion_horizontal.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion_vertical', 'assets/img/explosion_vertical.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion_up', 'assets/img/explosion_up.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion_right', 'assets/img/explosion_right.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion_down', 'assets/img/explosion_down.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion_left', 'assets/img/explosion_left.png', { frameWidth: 32, frameHeight: 32 });

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on('progress', (percent) => {
            console.log('LoadScene', percent);
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);

        });
    }

    create() {
        console.log('LoadScene:create');
        
        this.scene.start('menu');
    }

}