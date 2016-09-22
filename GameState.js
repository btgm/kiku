/*

 Kiku Game State Middleware
 ===

*/
var gameActions = require('./gameActions.js');

var GameState = function(req, res, next){


  if (typeof req.session.gameState != 'undefined' ) {

    console.log("Game in session!");
    // console.log(req.session.gameState);
    // playing the game

  }else{

    // Starting a new game
    console.log("Starting new game.");

    var gameState = gameActions.initalizeGameState();

    req.session.gameState = gameState;
  }
  next();
}

module.exports = GameState;
