var express = require('express');
var router = express.Router();

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

router.get('/discard/:hand/:card', function(req, res, next) {
  // reset the game state
  var hands = ['player', 'computer'],
      gameState = req.session.gameState,
      card = req.params.card*1;
  if (hands.indexOf(req.params.hand) > -1) {
    var hand = gameState[req.params.hand];
    
    // into the discard pile    
    gameState.discard.push( hand.splice(card,1)[0] );

    // pull one from the top
    if (gameState.deck.length > 0) {
      hand.push(gameState.deck.pop());          
    }else {
      // game is just about over...
    }
    
  }

  res.send('Discarded card #' + card + ' from ' + req.params.hand);
});


router.get('/state', function(req, res, next) {
  
  // log game state to console
  
  res.set({
    'Content-Type' : 'text/plain'
  });
  
  res.send(JSON.stringify(req.session.gameState, null, 4) );
});


module.exports = router;
