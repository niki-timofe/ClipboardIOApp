var express = require('express.io'), path = require('path'), lessMiddleware = require('less-middleware'), url = require("url");

app = express();
app.http().io();

app.enable('trust proxy');
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Setup the ready route, join room and broadcast to room.

app.io.route('ready', function(req) {
    var room = req.data.room || req.handshake.headers['x-forwarded-for'] || req.handshake.address.address;
    req.io.join(room);
    req.io.room(room).broadcast('announce');

});

app.io.route('update', function(req) {
    var room = req.data.room || req.handshake.headers['x-forwarded-for'] || req.handshake.address.address;
    req.io.room(room).broadcast('update', {message: req.data});
});

// Send the client html.
app.get('/*', function(req, res) {
    res.sendfile(__dirname + '/views/client.html')
});

app.listen(Number(process.env.PORT || 5000));