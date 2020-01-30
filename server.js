

require('@google-cloud/debug-agent').start();
var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var msgs = new Array, users = new Array();

app.use(express.static(__dirname)); 

class user {
    constructor(id, name, icon) {
        this.id = id; // socket id
        this.name = name;
        this.tid = new Date().toISOString();
        this.icon = icon;
    }
}
class message {
    constructor(mess, avs) {
        this.tid = new Date().toISOString();
        this.msg = mess;
        this.from = avs;
    }
}
function removeUser(id) { // usage: users = removeUser(id)
    return users.filter(u => u.id !== id);
}
function getUser(id) {
    var u = undefined;
    var uu = users.filter(u => u.id == id);
    if (uu.length > 0) u = uu[0];
    return u
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('new user', function (msg) {
        var id = socket.client.id, u = new user(id, msg, '', '');
        users.push(u);
        io.emit('users', users);
        console.log(' new user', id, msg)
        var mess = new message(msg + ' joined this chat', 'server europe-0' )
        socket.broadcast.emit('chat message', mess ); // to all except sender
        var us = 'There are ' + users.length + ' participants.  See history below';
        if (users.length == 1) {us = 'You are the only participant.'};
        mess = new message('Welcome to this chat ' + msg + '. ' + us,'server europe-0');
        socket.emit('history', msgs); // only to sender
        socket.emit('chat message', mess); // only to sender
    });
    socket.on('chat message', function (msg) {
        var id =socket.client.id,  u = getUser(id);
        if (u === undefined) {
            console.log('message from', id, ' no user found')
        } else {
            var mess = new message(msg, u.name);
            msgs.push(mess)
            io.emit('chat message', mess);
            if (msgs.length > 100) {msgs.shift}
        }
    });
    socket.on('disconnect', function () {
        var id = socket.client.id, u = getUser(id);
        if (u != undefined) {
            var su = u.name;
            try {
                var mess = new message(su + ' left this chat', 'server europe-0')
                io.emit('chat message', mess);
                users = removeUser(id);
                io.emit('users', users);
            }
            catch (e) {
                console.log(e)
                var mess = new message('problem with user ' + su + ' disconnecting ' + e.toString(), 'server europe-0')
                io.emit('chat message', );
            }
        } else {
            console.log('unrecognized id = ', id)
        }
    });
});


const PORT = process.env.PORT || 8080;
http.listen(PORT, function () {
    console.log('listening on http://localhost:' + PORT);
});

module.exports = app;

