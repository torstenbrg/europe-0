require('@google-cloud/debug-agent').start();

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = new Map();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('new user', function (msg) {
        users[socket.client.id] = msg;
        io.emit('new user', msg);
    });
    socket.on('chat message', function (msg) {
        msg = users[socket.client.id] + ': ' + msg
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        io.emit('user left: ' + users[socket.client.id]);
        users.delete[socket.client.id];
    });
});
const PORT = process.env.PORT || 8080;
http.listen(PORT, function () {
    console.log('listening on http://localhost:' + PORT);
});

module.exports = app;

