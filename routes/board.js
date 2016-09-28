var express = require('express');
var router = express.Router();
var gameActions = require('../gameActions.js');
var swig = require('swig');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var gameState = req.session.gameState;
  
  var templates = {
    'hand': swig.compileFile('views/templates/hand.html'),
    'played': swig.compileFile('views/templates/played.html'),
    'status': swig.compileFile('views/templates/status.html'),
  }
  
  // return the HTML snippets using element IDs as key
  var output = {
    'hand-computer': templates['hand']( { hand: gameState['computer'], handKey: 'computer' } ),
    'hand-player': templates['hand']( { hand: gameState['player'], handKey: 'player' } ),
    'played-cards': templates['played']( { played: gameState.played } ),
    'game-status': templates['status']( { gameState: gameState } ),
  };
  
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
