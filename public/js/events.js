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
    let elements = document.body.getElementsByClassName('building')
    let building
    for (let i = 0; i < elements.length; i++) {
      if (parseInt(elements[i].getAttribute('data-building-id')) === target) {
        building = elements[i]
        break;
    }
    }

    let newAtt = document.createAttribute('data-owner')
    newAtt.value = player
    building.setAttributeNode(newAtt)
  }.bind(null, target, player)
}

function placeRoadEventGenerator (target, player) {
  return function (target, player) {
    let elements = document.body.getElementsByClassName('road')
    let road
    for (let i = 0; i < elements.length; i++) {
      if (parseInt(elements[i].getAttribute('data-road-id')) === target) {
        road = elements[i]
        break;
      }
    }
    let newAtt = document.createAttribute('data-owner')
    newAtt.value = player
    road.setAttributeNode(newAtt)
  }.bind(null, target, player)
}
