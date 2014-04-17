var express = require('express.io'), path = require('path'), lessMiddleware = require('less-middleware');

app = express();
app.http().io();

app.enable('trust proxy');
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Setup the ready route, join room and broadcast to room.

app.io.route('ready', function(req) {
    req.io.join(req.handshake.headers['x-forwarded-for'] || req.handshake.address.address);
    req.io.room(req.handshake.headers['x-forwarded-for'] || req.handshake.address.address).broadcast('announce');

});

app.io.route('update', function(req) {
    req.io.room(req.handshake.headers['x-forwarded-for'] || req.handshake.address.address).broadcast('update', {message: req.data});
});

// Send the client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/client.html')
});

app.listen(Number(process.env.PORT || 5000));