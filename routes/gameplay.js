var express = require('express');
var router = express.Router();
var gameActions = require('../gameActions.js');

var HANDS = ['player', 'computer'];
var ACTIONS = ['play', 'discard', 'tellNumber', 'tellColor'];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Nothing!');
});


router.get('/reset', function(req, res, next) {
  // reset the game state
  req.session.destroy();
  console.log(req.session);
  res.send('Reset the game state');
});

router.get('/state', function(req, res, next) {

  // log game state to console

  res.set({
    'Content-Type' : 'text/plain'
  });

  res.send(JSON.stringify(req.session.gameState, null, 4) );
});


router.get('/:actionKey/:handKey/:cardIndex', function(req, res, next) {
  // reset the game state
  var gameState = req.session.gameState;
  var actionKey = req.params.actionKey;
  var handKey = req.params.handKey;
  var cardIndex = req.params.cardIndex*1;

  if (ACTIONS.indexOf(actionKey) < 0 ) {
    res.send('Unknown action: '+handKey);
  }
  else if (HANDS.indexOf(handKey) < 0) {
    res.send('Unknown hand: '+handKey);
  }
  else {
    gameActions[actionKey](gameState, handKey, cardIndex);
    res.send(actionKey+' card #' + cardIndex + ' from ' + handKey);
  }
});

module.exports = router;
