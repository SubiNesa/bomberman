let cursors;

export class ScoresScene extends Phaser.Scene {


    constructor() {
        super({key: 'scores'});
    }

    init(data) {
        console.log('scores');
        console.log(data);
        this.scores = data;
    }

    preload() {}

    create() {

        cursors = this.input.keyboard.createCursorKeys();

        // Title
        this.add.text(180, 150, `K / D`, { fontSize: '20px', fill: '#ffffff', fontWeight: 'bold'});
        let p = 0;
        for (const [id, data] of Object.entries(this.scores)) {
            p++;
            this.add.text(150 + (p * 120), 150, `${data.name}`, { fontSize: '20px', fill: '#ffffff', fontWeight: 'bold'});
            
            let a = 1;
            for (const [player_id, score] of Object.entries(this.scores)) {
                a++;
                if (player_id == id) {
                    let scr = data.deaths.filter(x => x === player_id);
                    console.log(scr);
                    this.add.text(100 + (a * 110), 150 + (p * 100), `${scr.length}`, { fontSize: '22px', fill: '#FFFF00', fontWeight: 'bold'});
                } else {
                    let scr = data.deaths.filter(x => x === player_id);
                    console.log('else',  scr);
                    this.add.text(100 + (a * 110), 150 + (p * 100), `${scr.length}`, { fontSize: '22px', fill: '#FFFF00', fontWeight: 'bold'});
                }
            }   
        }

        let i = 0;
        for (const [id, data] of Object.entries(this.scores)) {
            i++;
            // Content

            // Name
            this.add.text(50, 150 + (i * 100), `${data.name}`, { fontSize: '20px', fill: '#00ff00', fontFamily: '"Black Ops One", cursive'});
            // K / D
            this.add.text(180, 150 + (i * 100), `${data.kills.length} / ${data.deaths.length}`, { fontSize: '22px', fill: '#00ff00', fontWeight: 'bold'});
        }

        window.socket.disconnect();

        this.add.text(190, 600, `< PRESS ENTER TO CONTINUE >`, { fontSize: '23px', fill: '#ffffff'});
    }

    update() {
        if (cursors.space.isDown) {
            location.reload();
        }
    }
}