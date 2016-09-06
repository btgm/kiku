/*
 
 Kiku Game State
 ===

*/

var shuffle = require('knuth-shuffle').knuthShuffle;

var GameState = function(req, res, next){
  
  
  if (typeof req.session.gameState != 'undefined' ) {
    
    console.log("Game in session!");
    console.log(req.session.gameState);
    // playing the game
    
  }else{
    
    // Starting a new game
    console.log("Starting new game.");
    
    var colors = ['Red', 'Blue', 'Green', 'Yellow', 'White'],
        numbers = [1,1,1,2,2,3,3,4,4,5],
        deck =[],
        player = [],
        computer =[];
    
    // Setup and shuffle the deck        
    for (var c=0; c < colors.length;c++) {
      var color = colors[c];
      for (var n=0; n < numbers.length;n++) {
        var number = numbers[n];
        deck.push( {
          color: color,
          number: number,
          isColorKnown: false,
          isNumberKnown: false
        });
      }
    }
    
    shuffle(deck);
    
    for (var i=0; i < 5; i++) {
      player.push(deck.pop());
      computer.push(deck.pop());
    }
    
    req.session.gameState = {
      score: 0,
      deck: deck,
      player: player,
      computer: computer,
      fuseTokens: 3,
      timeTokens: 8
    }
    
  }
  next();  
}

module.exports = GameState;