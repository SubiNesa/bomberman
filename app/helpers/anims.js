import { ANIMATIONS } from '../src/config';

class Ainms {

    constructor({ bomberman }) {

        this.bomberman = bomberman;

        this.bomberman.anims.create({
            key: 'bomb',
            frames: this.bomberman.anims.generateFrameNumbers('bomb', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.bomberman.anims.create({
            key: 'bomb-faster',
            frames: this.bomberman.anims.generateFrameNumbers('bomb', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    

        this.bomberman.anims.create({
            key: 'explosion_center',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_center', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.bomberman.anims.create({
            key: 'explosion_up',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_up', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.bomberman.anims.create({
            key: 'explosion_down',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_down', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.bomberman.anims.create({
            key: 'explosion_left',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_left', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.bomberman.anims.create({
            key: 'explosion_right',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_right', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.bomberman.anims.create({
            key: 'explosion_horizontal',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_horizontal', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.bomberman.anims.create({
            key: 'explosion_vertical',
            frames: this.bomberman.anims.generateFrameNumbers('explosion_vertical', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
    }
}

export default Ainms;