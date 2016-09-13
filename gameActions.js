var shuffle = require('knuth-shuffle').knuthShuffle;

module.exports = {
  'initalizeGameState': function() {
    var colors = ['red', 'blue', 'green', 'yellow', 'white'],
        numbers = [1,1,1,2,2,3,3,4,4,5],
        deck =[],
        player = [],
        computer =[],
        played = {};

    // setup the played arrays
    for (var c = 0; c < colors.length; c++) {
      played[colors[c]] = [];
    }

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

    // deal out the cards
    for (var i=0; i < 5; i++) {
      player.push(deck.pop());
      computer.push(deck.pop());
    }

    var gameState = {
      gameFinished: false,
      score: 0,
      fuseTokens: 3,
      timeTokens: 8,
      played: played,
      player: player,
      computer: computer,
      discard: [],
      deck: deck,
    };

    return gameState;
  },

  'discard': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];

    var deck = gameState.deck;
    var discard = gameState.discard;

    // remove discarded card from hand
    var card = hand.splice(cardIndex,1)[0];

    // put into the discard pile
    gameState.discard.push(card);

    if (gameState.timeTokens < 8) {
      gameState.timeTokens++;
    }

    // deal card from top of deck to replace in hand
    if (gameState.deck.length > 0) {
      hand.push(gameState.deck.pop());
    }else if (gameState.computer.length === 4 && gameState.player.length === 4) {
      gameState.gameFinished = false;
    }
  },

  'play': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];

    var deck = gameState.deck;
    var played = gameState.played;
    var discard = gameState.discard;

    // remove played card from hand
    var card = hand.splice(cardIndex,1)[0];

    var color = card.color;

    if (played[color].length === card.number - 1) {
      // success!
      played[color].push(card);
      gameState.score++;
    }
    else {
      // fail!

      gameState.fuseTokens--;

      if (gameState.fuseTokens < 1) {
        gameState.gameFinished = true;
        return;
      }

      // put into the discard pile
      gameState.discard.push(card);
    }

    // deal card from top of deck to replace in hand
    if (gameState.deck.length > 0) {
      hand.push(gameState.deck.pop());
    }else if (gameState.computer.length === 4 && gameState.player.length === 4) {
      gameState.gameFinished = false;
    }
  },

  'tellNumber': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];
    var card = hand[cardIndex];
    var number = card.number * 1;

    if (gameState.timeTokens < 1) {
      return;
    }

    for (var h = 0; h < hand.length; h++) {
      if (hand[h].number == number) {
        hand[h].isNumberKnown = true;
      }
    }

    gameState.timeTokens--;
  },

  'tellColor': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];
    var card = hand[cardIndex];
    var color = card.color;

    if (gameState.timeTokens < 1) {
      return;
    }

    for (var h = 0; h < hand.length; h++) {
      if (hand[h].color == color) {
        hand[h].isColorKnown = true;
      }
    }

    gameState.timeTokens--;
  },
};

