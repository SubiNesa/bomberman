class Maps {

    constructor({ bomberman }) {

        this.bomberman = bomberman;
        this.map;
        this.layers = {
            map: {},
            breakable: {}
        };
        this.tables = {
            level: [],
            breakable: []
        }
        console.log(this);
        console.log(this.bomberman);

        /*
        var level = [
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 2, 2, 3, 3, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 3, 2, 3, 3, 3],
            [3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 3, 3, 2, 3],
            [3, 1, 2, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 3, 3, 3, 3],
            [3, 1, 3, 3, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3],
            [3, 1, 2, 3, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3],
            [3, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3],
            [3, 2, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3],
            [3, 1, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3],
            [3, 1, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 3, 2, 3],
            [3, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3],
            [3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3],
            [3, 1, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3, 3, 3, 2, 3, 2, 3, 3, 3],
            [3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 2, 2, 3, 2, 3],
            [3, 1, 2, 2, 3, 2, 3, 2, 3, 3, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3],
            [3, 1, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 1, 2, 2, 3, 2, 3, 2, 3, 3, 3, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
        ]

         - MIDLE OF CELL
        ------------------------------->
        { 16, 16 } { 48, 16 } { 64, 16 }
        { 16, 48 } [ 48, 48 ] [ 64, 48 ]
        { 16, 64 } [ 48, 64 ] [ 64, 64 ]

        */

        // build top external wall
        let rows = 17;
        let cols = 25;

        let level = [];
        let breakable = [];

        level[0] = [];
        let l = 0;
        while (l <= cols) {
            level[0].push(3);
            l++;
        }

        breakable[0] = [];
        let b = 0;
        while (b <= cols) {
            breakable[0].push(-1);
            b++;
        }

        for (var r = 1; r <= rows; r++) {
            if (!level[r]) {
                level[r] = [];
                breakable[r] = [];
            }
            for (var c = 0; c <= cols; c++) {;
                if (c === 0 || c === 24) {
                    // build external wall
                    level[r][c] = 3;
                    breakable[r][c] = -1;
                } else {
                    if (c % 2 == 0 && r % 2 == 0) {
                        // wall
                        level[r][c] = 3;
                        breakable[r][c] = -1;
                    } else {
                        // make sure to have free space from beginning
                        if (r == 1 && c == 1 || r == 1 && c == 2 || r == 2 && c == 1) {
                            // grace
                            level[r][c] = 2;
                            breakable[r][c] = -1;
                        } else if (r == 1 && c == 22 || r == 1 && c == 23 || r == 2 && c == 23) {
                            // grace
                            level[r][c] = 2;
                            breakable[r][c] = -1;
                        } else if (r == 16 && c == 1 || r == 17 && c == 2 || r == 17 && c == 1) {
                            // grace
                            level[r][c] = 2;
                            breakable[r][c] = -1;
                        } else if (r == 17 && c == 22 || r == 17 && c == 23 || r == 16 && c == 23) {
                            // grace
                            level[r][c] = 2;
                            breakable[r][c] = -1;
                        } else {
                            // random
                            let random = Math.floor(Math.random() * 2) + 1;
                            if (random == 1) {
                                // brick
                                breakable[r][c] = 1;
                                level[r][c] = 2;
                            } else {
                                // grace
                                level[r][c] = 2;
                                breakable[r][c] = -1;
                            }
                        }
                    }
                }
            }
        }

        // build bottom external wall
        level[level.length] = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
        breakable[breakable.length] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

        this.tables.level = level;
        this.tables.breakable = breakable;

        this.map = this.bomberman.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
        let tiles = this.map.addTilesetImage('tiles');
        this.layers.map = this.map.createStaticLayer(0, tiles, 0, 0);

        this.breakable = this.bomberman.make.tilemap({ data: breakable, tileWidth: 32, tileHeight: 32 });
        let breakableTiles = this.breakable.addTilesetImage('tiles');
        this.layers.breakable = this.breakable.createDynamicLayer(0, breakableTiles, 0, 0);

        // set collision on the walls and bricks
        this.layers.map.setCollision([3]);
        this.layers.breakable.setCollision([1]);
    }
}

export default Maps;