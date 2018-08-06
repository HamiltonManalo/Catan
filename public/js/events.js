
function showDecisionDialog(dataObject) {

  let element = document.querySelector('#dialog-box-hidden')
  element.setAttribute('id', 'dialog-box-show')
  let dialogHeader = dataObject.buildingType
  element.innerHTML = `<h2>Confirm to place ${dialogHeader}</h2>
  <hr/>
  <button class="confirm-btn" id="choice-yes">Place ${dialogHeader}</button>
  <button class="confirm-btn" id="choice-no">Don't place ${dialogHeader}</button>`
  
  
  
      let yesBtn = document.getElementById('choice-yes')
      yesBtn.addEventListener('click', function () {
        
        let element = document.getElementById('dialog-box-show')
        element.setAttribute('id', 'dialog-box-hidden')
        let elements;
        let structure; 
        
        httpPost('http://localhost:8080/confirmBuild', dataObject, function(result){
          result = JSON.parse(result);

        if(dataObject.buildingType === 'settlement' && result) {
          elements = document.body.getElementsByClassName('building')
        structure = elements[dataObject.nodeId]

        } else if(dataObject.buildingType === 'road' && result) {
          elements = document.body.getElementsByClassName('road')
          structure = elements[dataObject.nodeId]
        } else if(dataObject.buildingType === 'city' && result) {

        }
        let owner = document.createAttribute('data-owner');
        owner.value = dataObject.playerId;
        structure.setAttributeNode(owner); 
        element.innerHTML = null;
      })
      
 
    },
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

    let dataObject = {'playerId': player.id, 'buildingType': 'settlement', 'nodeId': target}
  
    socket.emit('validatePlaceAction', dataObject)
   
  }.bind(null, target, CurrentPlayer)
}

function placeRoadEventGenerator (target, player) {
  return function (target, player) {
   
    let dataObject = {'playerId': player.id, 'buildingType': 'road', 'nodeId': target}
    
      socket.emit('validatePlaceAction', dataObject)
    
  }.bind(null, target, player)
}



socket.on('placeActionResult', function (validation) { 
  if (validation.results) 
    showDecisionDialog(validation.data)

})

socket.on('nextTurn', function(data){
  console.log(data)
})