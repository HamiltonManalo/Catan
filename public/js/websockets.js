socket.connect('http://localhost')
socket.on('news', function (data) {
    console.log(data);
});

function validatePlayer(Player) {
    socket.emit('validateTurn', JSON.stringify(Player))
    let returnValue; 
    socket.on('validateTurnResponse', function(data) {
        console.log(Object.keys(data)[0] + " " + data.response)
        returnValue = data  ? JSON.parse(data.response) : false;
    })
    console.log('return value = ' + returnValue)
    return returnValue;
}