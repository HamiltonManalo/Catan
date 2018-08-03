// (function() {
// var element = document.getElementById
// }())

function showDecisionDialog (buildingObject) {
  let element = document.getElementById('dialog-box-hidden')
  element.setAttribute('id', 'dialog-box-show')
  let dialogHeader = buildingObject.buildingType
  element.innerHTML = `<h2>Confirm to place ${dialogHeader}</h2>
  <hr/>
  <button class="confirm-btn" id="choice-yes">Place${dialogHeader}</button>
  <button class="confirm-btn" id="choice-no">Don't place ${dialogHeader}</button>`
  
  
  
      let yesBtn = document.getElementById('choice-yes')
      yesBtn.addEventListener('click', function () {
  
      let element = document.getElementById('dialog-box-show')
      element.setAttribute('id', 'dialog-box-hidden')
      
      let buildResult = httpPost('http://localhost:8080/confirmBuild', buildingObject, function(){

        let building = getBuildingByNodeId(buildingObject.nodeId)
        let owner = document.createAttribute('data-owner');
        owner.value = buildingObject.playerId;
        building.setAttributeNode(owner); 
      })
      
 
    }.bind(null, buildingObject),
    { once: true }
  )

  let noBtn = document.getElementById('choice-no')
  noBtn.addEventListener(
    'click',
    function () {

      let element = document.getElementById('dialog-box-show')
      element.setAttribute('id', 'dialog-box-hidden')
    },
    { once: true }
  )
}

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
function placeSettlementEventGenerator (target, player) {

  return function placeHouse (target, player) {

    let newAtt = document.createAttribute('data-owner');
    let buildingObject ={'playerId': player.id, 'buildingType': 'settlement', 'nodeId': target}

    socket.emit('validatePlaceAction', buildingObject)
    socket.on('placeActionResult', function (validation) { 
      if (validation)  
        showDecisionDialog(buildingObject)
        
    })
  }.bind(null, target, CurrentPlayer)
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
      console.log('Road Validation Building Result' + validation)

      socket.emit('canBuildRoad', target)

      socket.on('CanBuildRoadResult', function (result) {
        showDecisionDialog(canBuildResult.buildingType)

        socket.on('serverConfirm', function (data) {
          if (result && data) {
           
          }
        })
      })
    })
  }.bind(CurrentPlayer, target, this)
}

function getBuildingByNodeId(nodeId) {
  let elements = document.body.getElementsByClassName('building')

  for (let i = 0; i < elements.length; i++) {
    if (parseInt(elements[i].getAttribute('data-building-id')) === nodeId) 
      return elements[i]
  }
}