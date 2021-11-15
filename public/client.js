var socket = io.connect('http://localhost:3000');
socket.on('connect', function(data){
    socket.emit('join','Nguoi dung vua moi truy cap');
});

socket.on('thress',function(data){
    $('#thread').append('<li>' + data + '<li>')
});

$('form').submit(function(){
    var message = $('message').val();
    socket.emit('message',message);
    this.reset();

    return false;

});