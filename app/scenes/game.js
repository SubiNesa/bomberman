let fpsText;
let clockText;
let lap = 0;
let scores = new Map();
let bombs = new Map();
let cursors;
let gameOver = false;
let bombMap = {};
let theBalks = [];
let scoresPosition = [
    {x: 6, y: 6},
    {x: 670, y: 6},
    {x: 6, y: 646},
    {x: 670, y: 646}
];

import Anims from "../helpers/anims";

import { ANIMATIONS, ASSETS } from '../src/config';

function makeKey({ x, y }) {
    return `${x}-${y}`;
}

function hasBombAt(coords) {
    return makeKey(coords) in bombMap;
};

function getCellPos(row, col) {
    return {
        cellRow: ((row + 16) / 32 - 1),
        cellCol: ((col + 16) / 32 - 1)
    };
};

function centerOfGrid(value) {
    let cellPos = Number((value / 32).toFixed(1));
    let smaller = Math.trunc(cellPos) * 32;
    let bigger = cellPos % 1 === 0 ? cellPos * 32 - 32 : Math.ceil(cellPos) * 32;

    return Math.round((smaller + bigger) / 2);
}

export class GameScene extends Phaser.Scene {


    constructor() {
        super({key: 'game'});
    }

    create() {
        gameOver = false;

        let that = this;

        this.map;
        this.layers = {
            map: {},
            breakable: {}
        };
        this.tables = {
            level: [],
            breakable: []
        }

        let level = window.bomberman.map.level;
        let breakable = window.bomberman.map.breakable;

        this.tables.level = level;
        this.tables.breakable = breakable;

        this.map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
        let tiles = this.map.addTilesetImage('tiles');
        this.layers.map = this.map.createStaticLayer(0, tiles, 0, 0);

        this.breakable = this.make.tilemap({ data: breakable, tileWidth: 32, tileHeight: 32 });
        let breakableTiles = this.breakable.addTilesetImage('tiles');
        this.layers.breakable = this.breakable.createDynamicLayer(0, breakableTiles, 0, 0);

        // set collision on the walls and bricks
        this.layers.map.setCollision([3]);
        this.layers.breakable.setCollision([1]);
        
        // create players
        for (const [id, data] of window.bomberman.players) {
            
            let player = this.physics.add.sprite(data.init.position[0], data.init.position[1], data.dude || 'dude', 11);
           
            if (!scores.has(id)) {                
                scores.set(id, that.add.text(scoresPosition[scores.size].x, scoresPosition[scores.size].y, 'K:0 D:0', { fontSize: '20px', fill: '#ffffff', fontStyle: 'bold'}));
            }

            console.log(scores);

            player.setBounce(0);
            player.setCollideWorldBounds(true);

            // make body smaller
            const radius = 11;
            player.body.setCircle(
                radius,
                2,
                17
            );

            // phisics between player and blocks
            this.physics.add.collider(player, this.layers.map);
            this.physics.add.collider(player, this.layers.breakable);

            window.bomberman.players.set(id, {...data, player});
            bombs.set(id, {spawnedBombCount: 0});

            this.anims.create({
                key: ANIMATIONS.PLAYER_LEFT + data.dude || 'dude',
                frames: this.anims.generateFrameNumbers( data.dude || 'dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
    
            this.anims.create({
                key: ANIMATIONS.PLAYER_RIGHT + data.dude || 'dude',
                frames: this.anims.generateFrameNumbers( data.dude || 'dude', { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
    
            this.anims.create({
                key: ANIMATIONS.PLAYER_UP + data.dude || 'dude',
                frames: this.anims.generateFrameNumbers( data.dude || 'dude', { start: 8, end: 9 }),
                frameRate: 5,
                repeat: -1
            });
    
            this.anims.create({
                key: ANIMATIONS.PLAYER_DOWN + data.dude || 'dude',
                frames: this.anims.generateFrameNumbers( data.dude || 'dude', { start: 10, end: 11 }),
                frameRate: 5,
                repeat: -1
            });
        }
        
        new Anims({ bomberman: this});
        // create anims frames

        cursors = this.input.keyboard.createCursorKeys();

        fpsText = this.add.text(364, 656, 'FPS: ', { fontSize: '14px', fill: '#00ff00', fontStyle: 'italic'});
        clockText = this.add.text(364, 8, '3:00', { fontSize: '16px', fill: '#00ff00', fontStyle: 'bold'});

        function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
        let time = 180; //180000

        let updateClock = setInterval(everySecond, 1000);

        function everySecond() {
            time--; 
            lap++;

            switch (lap) {
                case 20: {
                    for (const [id, data] of window.bomberman.players) {      
                        data.bombs = 2; 
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 40: {
                    for (const [id, data] of window.bomberman.players) {
                        data.range = 4;
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 60: {
                    for (const [id, data] of window.bomberman.players) {
                        data.bombs = 4;
                        data.range = 5;
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 80: {
                    for (const [id, data] of window.bomberman.players) {
                        data.bombs = 5;
                        data.range = 6;
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 100: {
                    for (const [id, data] of window.bomberman.players) {
                        
                        data.bombs = 4;
                        data.range = 7;
                        
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 120: {
                    for (const [id, data] of window.bomberman.players) {
                        
                        data.bombs = 6;
                        data.range = 8;
                        
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 140: {
                    for (const [id, data] of window.bomberman.players) {
                        
                        data.bombs = 7;
                        data.range = 9;
                        
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
                case 160: {
                    for (const [id, data] of window.bomberman.players) {
                        
                        data.bombs = 8;
                        data.range = 10;
                        
                        window.bomberman.players.set(id, data);
                    }
                    break;
                }
            }

            clockText.text = fmtMSS(time);
        }

        socket.on('end game scores', function(data) {
            gameOver = true;
            clearInterval(updateClock);
            scores.clear();
            that.scene.start('scores', data);
        });

        window.socket.on('player moved', dataMoved => {
            if (gameOver) {
                return;
            }

            let bomberman = window.bomberman.players.get(dataMoved.id);

            if (bomberman && bomberman.player && !gameOver) {

                const speed = 160;
                switch (dataMoved.direction) {
                    case ANIMATIONS.PLAYER_LEFT:
                        bomberman.player.setVelocityX(-speed);
                        bomberman.player.anims.play(ANIMATIONS.PLAYER_LEFT + bomberman.dude || 'dude', true);
                        break;
                    case ANIMATIONS.PLAYER_RIGHT:
                        bomberman.player.setVelocityX(speed);
                        bomberman.player.anims.play(ANIMATIONS.PLAYER_RIGHT + bomberman.dude || 'dude', true);
                        break;
                    case ANIMATIONS.PLAYER_UP:
                        bomberman.player.setVelocityY(-speed);
                        bomberman.player.anims.play(ANIMATIONS.PLAYER_UP + bomberman.dude || 'dude', true);
                        break;
                    case ANIMATIONS.PLAYER_DOWN:
                        bomberman.player.setVelocityY(speed);
                        bomberman.player.anims.play(ANIMATIONS.PLAYER_DOWN + bomberman.dude || 'dude', true);
                        break;
                    case 'player-stop': 
                        bomberman.player.setVelocityX(0);
                        bomberman.player.setVelocityY(0);
                        bomberman.player.anims.play(ANIMATIONS.PLAYER_DOWN + bomberman.dude || 'dude');
                        break;
                
                    default:
                        bomberman.player.setVelocityX(0);
                        bomberman.player.setVelocityY(0);
                        bomberman.player.anims.play(ANIMATIONS.PLAYER_DOWN);
                        break;
                }

                const {x, y} = bomberman.player;
                if (!gameOver) {
                    window.socket.emit('player correct moved', {id: dataMoved.id, x, y});
                }
            }
        });

        window.socket.on('player dropped bomb', bomberman => {
            if (gameOver) {
                return;
            }
            this.dropBomb(bomberman)
        });
        
        window.socket.on('player corrected moved', data => {
            if (gameOver) {
                return;
            }
            if (window.socket.id !== data.id) {
                
                let bomberman = window.bomberman.players.get(data.id);

                if (bomberman.player.x !== data.x) {
                    bomberman.player.x = data.x;
                    window.bomberman.players.set(data.id, bomberman);
                }
                if (bomberman.player.y !== data.y) {
                    bomberman.player.y = data.y;
                    window.bomberman.players.set(data.id, bomberman);
                }
            }
        });

        window.socket.on('explosion', data => {
            if (gameOver) {
                return;
            }
            let bomberman = window.bomberman.players.get(window.socket.id);
            
            if (bomberman.player) {
                if (data.currentRow == centerOfGrid(bomberman.player.x) && data.currentCol == centerOfGrid(bomberman.player.y) && bomberman.player.visible) {
                    window.socket.emit('kill', {kill_id: window.socket.id, killed_by: data.player_id});
                }
            }
        });
        
        window.socket.on('killed', data  => {
            if (gameOver) {
                return;
            }
            let bomberman = window.bomberman.players.get(data.kill_id);
            bomberman.player.visible = false;
            setTimeout(() => {
                bomberman.player.x = bomberman.init.position[0];
                bomberman.player.y = bomberman.init.position[1];
                bomberman.player.visible = true;
                window.bomberman.players.set(data.kill_id, bomberman);
            }, 2000);


            for (let [id, score] of scores) {
                score.text = `K:${data.scoreboard[id].kills.length} D:${data.scoreboard[id].deaths.length}`;
            }
        });

    }

    update(timestamp, dt) {
        
        if (gameOver) {
            return;
        }
        if (!this.lastUpdate) {
            this.lastUpdate = this.time.now;
        }

        
        const realDelta = this.time.now - this.lastUpdate;
        this.lastUpdate = this.time.now;

        fpsText.text = 'FPS: ' + dt.toFixed(2) + ' ' + realDelta.toFixed(2);

        this.blastedCells = [];

        let bomberman = window.bomberman.players.get(window.socket.id);

        if (cursors.left.isDown) {
            setPlayer(ANIMATIONS.PLAYER_LEFT);

        } else if (cursors.right.isDown) {
            setPlayer(ANIMATIONS.PLAYER_RIGHT);

        } else if (cursors.up.isDown) {
            setPlayer(ANIMATIONS.PLAYER_UP);

        } else if (cursors.down.isDown) {
            setPlayer(ANIMATIONS.PLAYER_DOWN);

        } else {
            setPlayer('player-stop');
        }

        function setPlayer(direction) {
            if (gameOver) {
                return;
            }

            if (bomberman && bomberman.player) {
                window.socket.emit('player move', {id: window.socket.id, direction, delta: realDelta});
            }
        }

        if (cursors.space.isDown && bomberman && bomberman.player) {
            window.socket.emit('player drop bomb', bomberman);
        }
    }

    dropBomb(bomberman) {
        const { x, y } = bomberman.player;
        const nX = centerOfGrid(x);
        const nY = centerOfGrid(y);
        if (!hasBombAt({ x: nX, y: nY })) {
            this.setupPlayerBombAt(nX, nY, bomberman);
        }
    }

    setupPlayerBombAt(nX, nY, bomberman) {
        let player_bomb = bombs.get(bomberman.id);
        if (player_bomb.spawnedBombCount >= bomberman.bombs) {
            return;
        } else {
            if (bomberman.player.visible) {
                player_bomb.spawnedBombCount++;
                bombs.set(bomberman.id, {spawnedBombCount: player_bomb.spawnedBombCount});
                this.registerBombAt(nX, nY, bomberman);
            }
        }
    }

    registerBombAt(nX, nY, bomberman) {

        const newBomb = this.add.sprite(nX, nY, ASSETS.BOMB, 1);


        for (const [id, data] of window.bomberman.players) {
            this.physics.add.collider(data.player, newBomb);

            window.bomberman.players.set(id, data);
        }

        const key = makeKey({ x: nX, y: nY });
        const range = bomberman.range;

        bombMap[key] = { sprite: newBomb, range, nX, nY, player_id: bomberman.id };

        const bombCollide = this.physics.add.existing(newBomb, true);
        bombCollide.anims.play('bomb');

        setTimeout(() => {
            if (!gameOver) {
                bombCollide.anims.play('bomb-faster');
            }
        }, 1000);

        setTimeout(() => {
            this.explodeBombAt(nX, nY, bomberman);
        }, 3000);
        //groups.addBomb(bombCollide);
    }

    explodeBombAt(nX, nY, bomberman) {
        const key = makeKey({ x: nX, y: nY });

        if (hasBombAt({ x: nX, y: nY })) {
            const bomb = bombMap[key];
            let player_bomb = bombs.get(bomberman.id);

            player_bomb.spawnedBombCount--;
            bombs.set(bomberman.id, {spawnedBombCount: player_bomb.spawnedBombCount});
            
            bomb.sprite.destroy(true);
            delete bombMap[key];

            this.putExplosionAt(nX, nY, bomb);
        }
    }
    
    putExplosionAt(nX, nY, bomb) {
        const row = nX;
        const col = nY;

        let explosionDirections = [
            { x: 0, y: -1, end: 'up', plumb: 'vertical' },
            { x: 1, y: 0, end: 'right', plumb: 'horizontal' },
            { x: 0, y: 1, end: 'down', plumb: 'vertical' },
            { x: -1, y: 0, end: 'left', plumb: 'horizontal' }
        ];

        // bomb it self
        this.addToBlasted(row, col, 'center', false);
        window.socket.emit('explosion', {currentRow: row, currentCol: col, player_id: bomb.player_id});

        let { cellRow, cellCol } = getCellPos(row, col);
        /*
    
        |------|------|------|------|------|
                48/16  80/16  112/16
        |------|------|------|------|------|
         16/48  48/48  80/48
        |------|------|------|------|------|
         16/80  *48/80 80/80
        |------|------|------|------|------|
         16/112 48/112 80/112 112/112
        |------|------|------|------|------|
        */


        for (let direction of explosionDirections) {
            for (let i = 1; i <= bomb.range; i++) {
                let currentRow = direction.x * i * 32 + row;
                let currentCol = direction.y * i * 32 + col;

                if (gameOver) {
                    return;
                }

                let { cellRow, cellCol } = getCellPos(currentRow, currentCol);

                let brick = this.tables.breakable[cellCol][cellRow];
                let cell = this.tables.level[cellCol][cellRow];

                let isWall = cell == 3 // WALL
                let isBalk = brick == 1 // DESTRUCTIBLE
                let isLast = (i == bomb.range);

                
                window.socket.emit('explosion', {currentRow, currentCol, player_id: bomb.player_id});

                // insert the brick to be destroyed
                if (isBalk) {
                    theBalks.push({ brick, row: cellRow, col: cellCol });
                }
                // the bomb to be destroyed
                if (hasBombAt({ x: currentRow, y: currentCol })) {
                    // delay of explosion
                    setTimeout(() => {
                        if (gameOver) {
                            return;
                        }
                        this.explodeBombAt(currentRow, currentCol);
                    }, 100);
                }

                if (isBalk || isWall || isLast) {
                    this.addToBlasted(currentRow, currentCol, direction.end, isBalk)
                    break;
                }

                this.addToBlasted(currentRow, currentCol, direction.plumb, isBalk)
            }
        }

        for (let cell of this.blastedCells) {

            if (gameOver) {
                return;
            }

            const newBlast = this.add.sprite(cell.row, cell.col, cell.type, 1);
            const blastCollide = this.physics.add.existing(newBlast, false);

            blastCollide.anims.play(cell.type);
            setTimeout(() => {
                newBlast.destroy(true);
            }, 1000);
        };

        this.destroyBalks();
    }

    destroyBalks() {
        theBalks.forEach((data, index) => {
            if (this.breakable.hasTileAt(data.row, data.col)) {

                this.tables.breakable[data.col][data.row] = 2;
                this.breakable.removeTileAt(data.row, data.col);
            }
        });
    }


    addToBlasted(row, col, direction, destroyed) {

        this.blastedCells.push({
            row: row,
            col: col,
            type: 'explosion_' + direction,
            destroyed: destroyed
        })
    }
}