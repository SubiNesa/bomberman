const socketIO = require('socket.io');
const map = require('./map.js');

let gameOver = false;
let gameInProgress = false;
let gameTime;

let players = new Map();
const positions = [
    [48, 70],
    [756, 70],
    [48, 584],
    [756,584]
];

const scoreboard = {};

const handleConnection = (server, socket) => {
    console.log(socket.id);

    if (!gameInProgress) {
        server.to(`${socket.id}`).emit('set game', JSON.stringify(Array.from(players)));
    }

    socket.on('join', function (player) {
        players.set(socket.id, {id: socket.id});
        players.set(socket.id, {
            id: socket.id, 
            name: player.name, 
            dude: player.dude, 
            init: {position: positions[players.size - 1] }, 
            range: 2, 
            bombs: 1,
            spawnedBombCount:0
        });

        scoreboard[socket.id] = {
            name: player.name,
            kills: [],
            deaths: []
        }

        server.emit('new players', JSON.stringify(Array.from(players)));
    });

    socket.on('get game', function () {
        console.log('get game', gameInProgress);
        if (!gameInProgress) {
            server.to(`${socket.id}`).emit('set game', JSON.stringify(Array.from(players)));
        }
    });

    socket.on('start game', function () {
        gameInProgress = true;
        gameOver = false;
        function endGame() {
            gameInProgress = false;
            gameOver = true;
            server.emit('end game scores', scoreboard);   
        }
        gameTime = setTimeout(endGame, 180000);

        server.emit('start', {
            map: map.getMap(), 
            players: JSON.stringify(Array.from(players))
        });
    });

    socket.on('player direction', function () {
        if (gameOver) {
            return;
        }
        server.emit('start', JSON.stringify(Array.from(players)));
    });

    socket.on('player move', function (data) {
        if (gameOver) {
            return;
        }
        server.emit('player moved', data);
    });

    socket.on('player correct moved', function (data) {
        if (gameOver) {
            return;
        }
        socket.broadcast.emit('player corrected moved', data);
    });

    socket.on('player drop bomb', function (data) {
        if (gameOver) {
            return;
        }
        server.emit('player dropped bomb', data);
    });

    socket.on('explosion', function (data) {
        if (gameOver) {
            return;
        }
        socket.emit('explosion', data);
    });

    socket.on('kill', function (data) {
        if (gameOver) {
            return;
        }

        if (data.kill_id == data.killed_by) {
            // suicide
            scoreboard[data.kill_id].deaths.push(data.killed_by);
        } else {
            scoreboard[data.killed_by].kills.push(data.kill_id);
            scoreboard[data.kill_id].deaths.push(data.killed_by);
        }
        
        server.emit('killed', {kill_id: data.kill_id, scoreboard});
    });

    socket.on('disconnect', function(){
        console.log(socket.id + ' user disconnected');
        players.delete(socket.id);
        delete scoreboard[socket.id];

        gameInProgress = false;
        gameOver = true;

        clearTimeout(gameTime);

        server.emit('delete players', JSON.stringify(Array.from(players)));
    });
}


exports.init = (server) => {
    const io = socketIO(server);
    io.on('connection', socket => handleConnection(io, socket));
};