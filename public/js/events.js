
function showDecisionDialog(dataObject) {

  let element = document.querySelector('#dialog-box-hidden');
  element.setAttribute('id', 'dialog-box-show');
  let dialogHeader = dataObject.buildingType;
  element.innerHTML = `<h2>Confirm to place ${dialogHeader}</h2>
  <hr/>
  <button class="confirm-btn" id="choice-yes">Place ${dialogHeader}</button>
  <button class="confirm-btn" id="choice-no">Don't place ${dialogHeader}</button>`;
  
      let yesBtn = document.getElementById('choice-yes');
      yesBtn.addEventListener('click', function () {
        
        let element = document.getElementById('dialog-box-show');
        element.setAttribute('id', 'dialog-box-hidden');
        let elements;
        let structure; 
        
        httpPost('http://localhost:8080/confirmBuild', dataObject, function(result){
          result = JSON.parse(result);

        if(dataObject.buildingType === 'settlement' && result) {
          elements = document.body.getElementsByClassName('building');
        structure = elements[dataObject.nodeId];

        } else if(dataObject.buildingType === 'road' && result) {
          elements = document.body.getElementsByClassName('road');
          structure = elements[dataObject.nodeId];
        } else if(dataObject.buildingType === 'city' && result) {

        }
        let owner = document.createAttribute('data-owner');
        owner.value = dataObject.playerId;
        structure.setAttributeNode(owner); 
        element.innerHTML = null;
        let playerIndex = gameState.players.findIndex(x => x.id === dataObject.playerId)
        updateResources(result.players[playerIndex]);
        gameState = result;
      });
    },
    { once: true }
  );

  let noBtn = document.getElementById('choice-no');
  noBtn.addEventListener(
    'click',
    function () {

      let element = document.getElementById('dialog-box-show');
      element.innerHTML = null;
      element.setAttribute('id', 'dialog-box-hidden');
    },
    { once: true }
  );
}

function choosePlayerToRob(playersToRob) { 
  if(!playersToRob[0]) 
    return;
    let element = document.querySelector('#dialog-box-hidden');
    element.setAttribute('id', 'cardbox-box-show');
     
  let cardContainer = document.createElement('div');

  playersToRob.forEach(player => {
    let newElement = document.createElement('span');
    newElement.id = player.id
    newElement.innerText = `Rob player ${player.id} \r player has ${player.numberOfCards} cards`
    newElement.classList.add('card', `player${player.id}`);
    newElement.addEventListener('click', selectCardToSteal)
    cardContainer.appendChild(newElement);
  });
  
  let newBtn = document.createElement('button');
  newBtn.id = "confirm-btn";
  newBtn.innerText = 'Select card';
  newBtn.classList.add('game-setup-btn');
  newBtn.addEventListener('click', confirmPlayerToStealFrom, {'once': true})
  let btnContainer = document.createElement('div');
  btnContainer.appendChild(newBtn);
  let header = document.createElement('h2')
  header.innerText = 'Select player to steal from!'
  cardContainer.id = 'cardDiv'
  element.appendChild(header)
  element.appendChild(cardContainer);
  element.appendChild(btnContainer)
}



//Used anytime cards need to be displayed to a player. Add option for multi-card select for events like
//discarding cards or playing year of plenty 
function cardBox(dataObject) {
  let element = document.querySelector('#dialog-box-hidden');
  element.setAttribute('id', 'cardbox-box-show'); // <---May want to change ID, same w/ dice box so they can have their own css. 
  let counter = 0;
 
  let cardContainer = document.createElement('div');
  
  dataObject.hand.forEach(card => {
    let newElement = document.createElement('span');
    newElement.id = card.cardId
    newElement.classList.add('card', 'facedown');
    // newElement.innerText = 'a'
    newElement.addEventListener('click', selectCardToSteal)
    cardContainer.appendChild(newElement);
  });
  let newBtn = document.createElement('button');
  let btnContainer = document.createElement('div');
  let header = document.createElement('h2')
  
  cardContainer.id = 'cardDiv'
  header.innerText = 'Select a card to steal';
  newBtn.id = "confirm-btn";
  newBtn.innerText = 'Select card';
  newBtn.classList.add('game-setup-btn');
  newBtn.addEventListener('click', confirmCardToSteal, {'once': true})
  
  btnContainer.appendChild(newBtn);
  element.appendChild(header)
  element.appendChild(cardContainer)
  element.appendChild(btnContainer);
}

{
  hand: [ 
    {type: 'wood', id: 'card0'},
    {type: 'ore', id: 'card1'}
  ]
}


function selectCardToSteal(event) {
  
  let alreadySelected = document.querySelectorAll('.selected');
  let card = event.currentTarget;
  if(card.classList.contains('selected')) {
    gameState.selected = false;
    card.classList.remove('selected');
  } else if(alreadySelected[0]){
    return;
  } else {
    gameState.selected = true;
    card.classList.add('selected');
  }

}

function showDice(rolls) {
  
    let element = document.querySelector('#dialog-box-hidden');
    element.setAttribute('id', 'dialog-box-show');
    let text = `<div> <p> player ${rolls.nextActivePlayer} rolled <p> </div>`
    let die1;
    let die2; 
    switch(rolls.roll1) {
  
      case 1: 
        die1 = `<div class="dice one">
                  <div class="dot"></div>
                </div>`
        break;
      
      case 2: 
        die1 =  `<div class="dice two">
                  <div class="dot"></div><div class="dot"></div>
                </div>`
        break;
      
      case 3: 
        die1 = `<div class="dice three">
                  <div class="dot"></div><div class="dot"></div><div class="dot"></div>
               </div>`
        break;
      
      case 4: 
        die1 = `<div class="dice four">
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
              </div>`
        break;
  
      case 5:
        die1 = `<div class="dice five">
                    <div class="row">
                      <div class="dot"></div><div class="dot"></div>
                    </div>
                    <div class="row">
                      <div class="dot"></div>
                    </div>
                    <div class="row">
                      <div class="dot"></div><div class="dot"></div>
                    </div>
                </div>`
        break;
  
      case 6: 
        die1 = `<div class="dice six">
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
                </div>`
        break;
    }
    switch(rolls.roll2) {
  
      case 1: 
      die2 = `<div class="dice one">
                <div class="dot"></div>
              </div>`
      break;
    
    case 2: 
      die2 =  `<div class="dice two">
                <div class="dot"></div><div class="dot"></div>
              </div>`
      break;
    
    case 3: 
      die2 = `<div class="dice three">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>`
      break;
    
    case 4: 
      die2 = `<div class="dice four">
                <div class="row">
                  <div class="dot"></div><div class="dot"></div>
                </div>
                <div class="row">
                  <div class="dot"></div><div class="dot"></div>
                </div>
            </div>`
      break;
  
    case 5:
      die2 = `<div class="dice five">
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
                  <div class="row">
                    <div class="dot"></div>
                  </div>
                  <div class="row">
                    <div class="dot"></div><div class="dot"></div>
                  </div>
              </div>`
      break;
  
    case 6: 
      die2 = `<div class="dice six">
                <div class="row">
                  <div class="dot"></div><div class="dot"></div>
                </div>
                <div class="row">
                  <div class="dot"></div><div class="dot"></div>
                </div>
                <div class="row">
                  <div class="dot"></div><div class="dot"></div>
                </div>
              </div>`
      break;
    }
    element.innerHTML = text + die1 + die2;
    setTimeout(() => {
      element.innerHTML = null
      element.setAttribute('id', 'dialog-box-hidden');
    
    }, 1500)
  };


  function dragAndDrop (target) {
  var element = document.getElementById(target);
  var mover = false, x, y, posx, posy, first = true;
  element.onmousedown = function () {
    mover = true;
  };
  element.onmouseup = function () {
    mover = false;
    first = true;
  };
  element.onmousemove = function (e) {
    if (mover) {
      if (first) {
        x = e.offsetX;
        y = e.offsetY;
        first = false;
      }
      posx = e.pageX - x;
      posy = e.pageY - y;
      this.style.left = posx + 'px';
      this.style.top = posy + 'px';
    }
  };
}

socket.on('placeActionResult', function (validation) { 
  if (validation.results) 
    showDecisionDialog(validation.data);

});

socket.on('nextTurn', function(updateData){
  showDice(updateData);
  updateResources(updateData.players.find(player => player.id === CurrentPlayer.id));
});