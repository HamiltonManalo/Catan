socket.connect('http://localhost')

function changePlayer(nextPlayer) {
    console.log("Last player " + CurrentPlayer);
    console.log("Next Player " + nextPlayer);
    CurrentPlayer = nextPlayer;
  
  }
socket.on('hello', function(response){
  console.log('hello!')
})

