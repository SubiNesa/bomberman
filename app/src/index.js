import io from "socket.io-client";
import Phaser from "phaser";
import { LoadScene } from "../scenes/load";
import { MenuScene } from "../scenes/menu";
import { GameScene } from "../scenes/game";
import { ScoresScene } from "../scenes/scores";


var gameOver = false;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 672,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {},
            debug: true
        },
        fps:{
            target: 30,
            forceSetTimeOut: true
        }
    },
    scene: [
        LoadScene, 
        MenuScene,
        GameScene, 
        ScoresScene
    ]
};


(function() {

    window.onload = function() {

        window.socket = io({
            autoConnect: false
        });

        class Game extends Phaser.Game {
            constructor() {
                super(config);
            }
        }

        new Game();
    };
})();