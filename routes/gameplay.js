var express = require('express');
var router = express.Router();
var gameActions = require('../gameActions.js');

var HANDS = ['player', 'computer'];
var ACTIONS = ['play', 'discard', 'tellNumber', 'tellColor'];
var PLAYERACTIONS = ['play', 'discard' ];
var COMPUTERACTIONS = ['tellNumber', 'tellColor'];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Nothing!');
});


router.get('/reset', function(req, res, next) {
  // reset the game state
  req.session.destroy();
  // console.log(req.session);
  res.redirect('/');
  // res.send('Reset the game state');
});

router.get('/state', function(req, res, next) {

  // log game state to console

  res.set({
    'Content-Type' : 'text/plain'
  });

  res.send(JSON.stringify(req.session.gameState, null, 4) );
});


router.get('/:actionKey/:handKey/:cardIndex/:isPost?', function(req, res, next) {
  // console.log(req.path)
  // reset the game state
  var gameState = req.session.gameState;
  var actionKey = req.params.actionKey;
  var handKey = req.params.handKey;
  var cardIndex = req.params.cardIndex*1;
  var isPost = (typeof req.params.isPost == 'undefined') ? false : true;


  if (ACTIONS.indexOf(actionKey) < 0 ) {
    res.send('Unknown action: '+handKey);
  }
  else if (HANDS.indexOf(handKey) < 0) {
    res.send('Unknown hand: '+handKey);
  }
  else if (isPost && handKey == 'player' && PLAYERACTIONS.indexOf(actionKey) < 0 ) {
    res.send('Illegal move by player on own hand.');
  }
  else if (isPost && handKey == 'computer' && COMPUTERACTIONS.indexOf(actionKey) < 0 ) {
    res.send('Illegal move by player on computer hand.');
  }
  else {
    var successful = gameActions[actionKey](gameState, handKey, cardIndex);

    if (successful) {
      gameActions['calculateBothHands'](gameState);

      // if it's a post it was the player's play
      if (isPost && !gameState.gameFinished) {
        // computer makes a play
        try {
          var computerPlay = gameActions.calculateComputerMove(gameState, 'computer', 0);
          console.log('computerPlay', computerPlay);
          gameActions[computerPlay.action](gameState, computerPlay.handKey, computerPlay.cardIndex);
        }
        catch(err) {
          console.error(err.message);
        }

      }
    }

    gameActions['calculateBothHands'](gameState);

    if (req.xhr) {
      console.log('xhr request');
      res.redirect('/board/');
    }
    else {
      console.log('normal request');
      res.redirect('/');
    }
  }
});

/* Take POST from form and redirect as appropriate */
router.post('/', function(req, res, next) {
  console.log(req.body)
  var cardIndex = req.body.card.split(',')[0],
      handKey = req.body.card.split(',')[1],
      actionKey = req.body.action;

      res.redirect('/gameplay/'+actionKey+'/'+handKey+'/'+cardIndex+'/post');
});


module.exports = router;
