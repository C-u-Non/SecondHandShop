var express = require('express');
var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

app.get('/', function (req, res, ext) {
    res.sendfile(__dirname + "/public/index.html");
});

app.use(express.static('public'));
//Server bắt kết nối từ sự kiện kết nối
io.on('connection', function (client) {
    console.log('Client đang kết nối...');
    client.on('join', function (data) {
        console.log(data);
    });
    client.on('messages',function(data){
        client.emit('thread',data);
        client.broadcast.emit('thread',data);
    });
});
server.listen(8000);