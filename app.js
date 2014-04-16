app = require('express.io')();
app.http().io();

// Setup the ready route, join room and broadcast to room.

app.io.route('ready', function(req) {
    req.io.join(req.handshake.address.address);
    req.io.room(req.handshake.address.address).broadcast('announce')
});

app.io.route('update', function(req) {
    console.log(req.io.room(req.handshake.address.address))
    req.io.room(req.handshake.address.address).broadcast('update', {message: req.data});
});

// Send the client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/client.html')
});

app.listen(Number(process.env.PORT || 5000));