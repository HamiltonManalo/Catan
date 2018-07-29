socket.connect('http://localhost')
socket.on('connection', function(data) {
    socket.on('news', function() {
    console.log(data);
    });
    console.log('its making the thing');
    socket.on('my other event', function (data) {
        console.log(data);
      });
})