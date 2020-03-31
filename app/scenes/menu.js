let buttons = {};
let choosed;

export class MenuScene extends Phaser.Scene {

    constructor() {
        super({key: 'menu'});
    }

    init() {
        console.log('menu');
    }

    create() {

        window.socket.open();

        let that = this;
        let startBtn;
        const players = [
            {
                name:'PLAYER 1',
                dude: 'dudeone',
                img: {
                    position: [150, 200]
                    
                },
                btn: {
                    position: [100, 250]
                }
            },
            {
                name:'PLAYER 2', 
                dude: 'dudetwo',
                img: {
                    position: [300, 200]
                    
                },
                btn: {
                    position: [250, 250]
                }
            },
            {
                name:'PLAYER 3', 
                dude: 'dudethree',
                img: {
                    position: [450, 200]
                    
                },
                btn: {
                    position: [400, 250]
                }
            },
            {
                name:'PLAYER 4',
                img: {
                    position: [600, 200]
                    
                },
                btn: {
                    position: [550, 250]
                }
            },
            {
                name:'PLAYER 5', 
                img: {
                    position: [150, 400]
                    
                },
                btn: {
                    position: [100, 450]
                }
            },
            {
                name:'PLAYER 6', 
                img: {
                    position: [300, 400]
                    
                },
                btn: {
                    position: [250, 450]
                }
            },
            {
                name:'PLAYER 7', 
                img: {
                    position: [450, 400]
                    
                },
                btn: {
                    position: [400, 450]
                }
            },
            {
                name:'PLAYER 8', 
                img: {
                    position: [600, 400]
                    
                },
                btn: {
                    position: [550, 450]
                }
            }
        ];

        startBtn = that.add.text(550, 550, 'START', { fontSize: '35px', fill: '#fff', fontFamily: '"Black Ops One", cursive' });
        startBtn.visible = false;
        choosed = that.add.text(250, 100, 'PLAYER ALREADY CHOSEN', { fontSize: '20px', fill: '#fff', fontFamily: '"Black Ops One", cursive'});
        choosed.visible = false;
        let textWaiting = that.add.text(260, this.game.renderer.height / 2, 'WAITING FOR FREE SLOT ...', { fontSize: '20px', fill: '#fff', fontFamily: '"Black Ops One", cursive' });
        
        var checkGame = setInterval(function() {
            window.socket.emit('get game');
        }, 5000);
        

        window.socket.on('set game', function(data) {
            clearInterval(checkGame)
            textWaiting.destroy();

            let res = JSON.parse(data);

            players.forEach(player => {
                that.displayPlayer(player);
            });
    
            if (res.length > 0) {
                let joined = new Map(res);

                if (joined.size < 5) {    
                    updateDisplayPlayer(joined);
                }
            }
        });

        window.socket.on('start', function(data) {
            let joined = new Map(JSON.parse(data.players));

            window.bomberman = {
                players: joined,
                map: data.map
            };

            that.scene.start('game');
        });

        window.socket.on('new players', function(data) {
            updateDisplayPlayer(new Map(JSON.parse(data)));
        });

        socket.on('delete players', function(data) {
            let joined = new Map(JSON.parse(data));

            if (joined.size < 2 && startBtn) {
                startBtn.visible = false;
            }

            updateDisplayPlayer(joined);
        });

        function updateDisplayPlayer(joined) {
            players.forEach(player => {
                if ( buttons[player.name]) {
                    buttons[player.name].taken = false;
                    that.enterButtonRestState(buttons[player.name]);
                }
            });

            if (joined.size > 1 && startBtn) {
                startBtn
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    socket.emit('start game');
                });
                startBtn.visible = true;
            }

            for (let [key, value] of joined) {
                let player = players.find(player => player.name == value.name);
                buttons[player.name].taken = true;
                that.setEnterButtonActiveState(buttons[player.name]);
            }
        }
    }

    displayPlayer(player) {
        this.add.image(player.img.position[0], player.img.position[1], player.dude || "dude", 11);
        buttons[player.name] = this.add.text(player.btn.position[0], player.btn.position[1], player.name, { fontSize: '20px', fill: '#0f0', fontFamily: '"Black Ops One", cursive' })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.enterButtonActiveState(player))
    }
  
    enterButtonRestState(clickButton) {
        clickButton.setStyle({ fill: '#0f0' });
    }
  
    enterButtonActiveState(player) {
        if (buttons[player.name] && !buttons[player.name].taken) {
            window.socket.emit('join', player);
        } else {
            choosed.visible = true;
            setTimeout(function(){ choosed.visible = false; }, 3000);
        }
    }
  
    setEnterButtonActiveState(clickButton) {
        clickButton.setStyle({ fill: '#FFFF00' });
    }
        
}