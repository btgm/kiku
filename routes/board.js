var express = require('express');
var router = express.Router();
var gameActions = require('../gameActions.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Nothing!');
});

router.get('/hand/:handKey', function(req, res, next) {
  var handKey = req.params.handKey;
  var gameState = req.session.gameState;
  
  
  
  res.render('templates/hand', {
    hand: gameState[handKey],
    handKey: handKey
  });
  
  
});

module.exports = router;
