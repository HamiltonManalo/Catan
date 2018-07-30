function dragAndDrop (target) {
  var element = document.getElementById(target)
  var mover = false, x, y, posx, posy, first = true
  element.onmousedown = function () {
    mover = true
  }
  element.onmouseup = function () {
    mover = false
    first = true
  }
  element.onmousemove = function (e) {
    if (mover) {
      if (first) {
        x = e.offsetX
        y = e.offsetY
        first = false
      }
      posx = e.pageX - x
      posy = e.pageY - y
      this.style.left = posx + 'px'
      this.style.top = posy + 'px'
    }
  }
}
function placeTownEventGenerator (target, player) {
  return function placeHouse (target, player) {
    // Move logic into socket call

    let elements = document.body.getElementsByClassName('building')
    let building
    for (let i = 0; i < elements.length; i++) {
      if (parseInt(elements[i].getAttribute('data-building-id')) === target) {
        building = elements[i]
        break
      }
    }
    let newAtt = document.createAttribute('data-owner');
    newAtt.value = player.id;

    socket.emit('validateTurn', JSON.stringify(player))
    socket.on('validateTurnResponse', function (validation) {
        socket.emit('canBuildBuilding',target);
        console.log('Building Validation Result = ' + validation);
        socket.on('canBuildBuildingResult', function(canBuildBuildingResult){
            if(validation && canBuildBuildingResult)
              building.setAttributeNode(newAtt);
        })
    })

  }.bind(null , target, CurrentPlayer)
}

function validatePlayer (Player) {
    
  }


function placeRoadEventGenerator (target, player) {
  return function (target, player) {
    let elements = document.body.getElementsByClassName('road')
    let road
    for (let i = 0; i < elements.length; i++) {
      if (parseInt(elements[i].getAttribute('data-road-id')) === target) {
        road = elements[i]
        break
      }
    }
    let newAtt = document.createAttribute('data-owner')
    newAtt.value = this.id

    socket.emit('validateTurn', JSON.stringify(player))
    socket.on('validateTurnResponse', function (validation) {
        console.log('Road Validation Building Result' + validation);
        socket.emit('canBuildRoad',target);
        socket.on('CanBuildRoadResult', function(result) {
            if(result) {
                road.setAttributeNode(newAtt)
            }
        })
    })
  }.bind(CurrentPlayer, target, this)
}
