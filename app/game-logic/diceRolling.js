function rollDice() {
    let diceRoll1 = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    let diceRoll2 = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    return [diceRoll1, diceRoll2];
}

module.exports = rollDice; 