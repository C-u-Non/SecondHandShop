var express = require('express');
var app = express();

var server = require('socket.io')(server);

app.get('/',function(req,res,ext){
    res.sendfile(__dirname+"/public/index.html");
});

app.use(express.static('public'));

io.on('connection',function(client){
    console.log('Mot thiet bi vua moi truy cap')
    client.on('join',function(data){
        console.log(data);
    });
    client.on('message',function(data){
        client.emit('thread',data);
        client.broadcast.emit('thread',data);
    });
});

server.listen(3000);