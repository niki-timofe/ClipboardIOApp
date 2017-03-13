"use strict";

var express = require('express'),
    path = require('path'),
    less = require('less-middleware'),
    crypto = require('crypto'),
    url = require('url'),
    http = require('http');


/**
 * Init app
 */
var app = express(),
    server = http.Server(app),
    io = require('socket.io')(server);


/**
 * Use LESS-static
 */
app.use(less(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


/**
 * For Heroku proxies
 */
app.enable('trust proxy');


/**
 * Send client-side
 */
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/views/client.html')
});


/**
 * Sockets
 */
io.on('connection', function (socket) {
    var path = url.parse(socket.request.headers.referer).path;
    var room = path == '/' ? socket.request.headers['x-forwarded-for'] : path;
    console.log('Connection to ', room, socket.request.headers['x-forwarded-for']);
    socket.join(room);

    socket.emit('joined', {room: room});

    socket.on('ready', function () {
        socket.to(room).emit('announce');
    });

    socket.on('update', function (mes) {
        socket.broadcast.to(room).emit('update', mes);
    });
});


server.listen(Number(process.env.PORT || 5000), function () {
    console.log('Listening on port ' + Number(process.env.PORT || 5000))
});