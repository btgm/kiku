var express = require('express');
var router = express.Router();
var gameActions = require('../gameActions.js');
var swig = require('swig');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var gameState = req.session.gameState;
  console.log(__dirname);
  var templates = {
    'index': swig.compileFile(__dirname + '/../views/templates/board.html'),
    'hand-player': swig.compileFile(__dirname + '/../views/templates/hand-player.html'),
    'hand-computer': swig.compileFile(__dirname + '/../views/templates/hand-computer.html'),
    'played': swig.compileFile(__dirname + '/../views/templates/played.html'),
    'status': swig.compileFile(__dirname + '/../views/templates/status.html'),
    'discard': swig.compileFile(__dirname + '/../views/templates/discard.html'),
    'log':  swig.compileFile(__dirname + '/../views/templates/log.html'),
  }

  if (gameState.gameFinished) {
    // return the HTML snippets using element IDs as key
    var output = {
      'the-universe': templates['index']( { gameState: gameState } ),
      'computer-move-description': gameState.log[gameState.log.length - 1],
      'player-move-description': gameState.log[gameState.log.length - 2],
    };
  }
  else {
    // return the HTML snippets using element IDs as key
    var output = {
      'hand-computer': templates['hand-computer']( { gameState: gameState } ),
      'hand-player': templates['hand-player']( { gameState: gameState } ),
      'played-cards': templates['played']( { gameState: gameState } ),
      'game-status': templates['status']( { gameState: gameState } ),
      'hand-discard': templates['discard']( { gameState: gameState } ),
      'game-log': templates['log']( { gameState: gameState } ),
      'computer-move-description': gameState.log[gameState.log.length - 1],
      'player-move-description': gameState.log[gameState.log.length - 2],
    };
  }

  res.set({
    'Content-Type' : 'text/plain'
  });

  res.send(output);
});

router.get('/hand/:handKey', function(req, res, next) {
  var handKey = req.params.handKey;
  var gameState = req.session.gameState;

  res.render('templates/hand', {
    hand: gameState[handKey],
    handKey: handKey
  });
});

router.get('/played', function(req, res, next) {
  var gameState = req.session.gameState;

  res.render('templates/played', {
    played: gameState.played
  });
});

router.get('/status', function(req, res, next) {
  var gameState = req.session.gameState;

  res.render('templates/status', {
    gameState: gameState
  });
});


module.exports = router;
