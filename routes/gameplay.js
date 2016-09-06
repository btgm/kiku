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


router.get('/state', function(req, res, next) {
  
  // log game state to console
  
  res.set({
    'Content-Type' : 'text/plain'
  });
  
  res.send(JSON.stringify(req.session.gameState, null, 4) );
});


module.exports = router;
