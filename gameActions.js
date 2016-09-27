var shuffle = require('knuth-shuffle').knuthShuffle;
var colors = ['red', 'blue', 'green', 'yellow', 'white'],
numbers = [1,1,1,2,2,3,3,4,4,5];

module.exports = {
  'initalizeGameState': function() {
    var deck =[],
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
          isNumberKnown: false,
          canPlay: 0,
          canDiscard: 0
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
      log: []
    };

    this.calculateBothHands(gameState);

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

    gameState.log.push(handKey + ' discarded card #' + cardIndex);
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
      gameState.log.push(handKey + ' played card #' + cardIndex + ' successfully');
    }
    else {
      // fail!

      gameState.fuseTokens--;

      if (gameState.fuseTokens < 1) {
        gameState.gameFinished = true;
        gameState.log.push(handKey + ' played card #' + cardIndex + ' unsuccessfully and ENDED THE GAME');
        return;
      }

      // put into the discard pile
      gameState.discard.push(card);
      gameState.log.push(handKey + ' played card #' + cardIndex + ' unsuccessfully');
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

    gameState.log.push(handKey + ' was informed about all their ' + number + ' cards');
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

    gameState.log.push(handKey + ' was informed about all their ' + color + ' cards');
    gameState.timeTokens--;
  },

  'calculateBothHands': function(gameState) {
    this.calculateHand(gameState, 'computer');
    this.calculateHand(gameState, 'player');
  }, 

  'calculateHand': function(gameState, handKey) {
    var hand = gameState[handKey];
    var playability = 0;
    var discardability = 0;

    for (var c=0; c < hand.length; c++) {
      hand[c].canDiscard = this.canDiscard(gameState, handKey, c);
      hand[c].canPlay = this.canPlay(gameState, handKey, c);
      playability += hand[c].canPlay;
      discardability += hand[c].canDiscard;      
    }
    
    gameState[handKey + 'Hand'] = {
      "playability": playability,    
      "discardability": discardability
    }

  },
  'canPlay': function(gameState, handKey, cardIndex) {
    var possibilities = this.getPossibilities(gameState, handKey, cardIndex);

    var plays = [];
    for (var p = 0; p < possibilities.length; p++) {
      // can be played?
      if (possibilities[p].number == 1+gameState.played[possibilities[p].color].length) {
        plays.push(possibilities[p]);
      }
    }
    if (handKey === 'player') {
    console.log("====================")
    console.log(possibilities)
    console.log("-----------------------------")
    console.log(plays)
    console.log("====================")
    }
    return Math.round(plays.length/possibilities.length*100)/100;
  },

  'canDiscard': function(gameState, handKey, cardIndex) {
    var possibilities = this.getPossibilities(gameState, handKey, cardIndex);

    // of those possibilities, are any of these cards that _haven't_ been played
    // but are the last of their type?
    var badPossibilities = [];
    for (var p = 0; p < possibilities.length; p++) {
      // has been played?
      var played = false;
      for (var color in gameState.played) {
        for (var i = 0; i < gameState.played[color].length; i++) {
          var number = gameState.played[color][i].number;
          if (possibilities[p].number == number && possibilities[p].color == color) {
            played = true;
          }
        }
      }
      // if has been played, then it wouldn't be bad to discard
      if (played) {
        continue;
      }

      // now check and see if it's the last of type, and if it is, then it would be
      // bad
      var count = 0;
      for (var i = 0; i < possibilities.length; i++) {
        if (possibilities[p].number == possibilities[i].number && possibilities[p].color == possibilities[i].color) {
          count++;
        }
      }

      if (count == 1) {
        badPossibilities.push(possibilities[p]);
      }
    }

    return Math.round(100-badPossibilities.length/possibilities.length*100)/100;
  },

  'getPossibilities': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];
    var oppositeHandKey = (handKey == 'computer') ? 'player' : 'computer';
    var card = hand[cardIndex];

    // all possibilities
    var possibilities = [];
    for (var c=0; c < colors.length; c++) {
      var color = colors[c];
      for (var n=0; n < numbers.length; n++) {
          var number = numbers[n];
          possibilities.push({color: color, number: number});
      }
    }

    // eliminate wrong numbers
    if (card.isNumberKnown) {
      for (var p = 0; p < possibilities.length; p++) {
        if (possibilities[p].number != card.number) {
          possibilities.splice(p, 1);
          p--;
        }
      }
    }

    // eliminate wrong colors
    if (card.isColorKnown) {
      for (var p = 0; p < possibilities.length; p++) {
        if (possibilities[p].color != card.color) {
          possibilities.splice(p, 1);
          p--;
        }
      }
    }

    // eliminate played cards
    for (var color in gameState.played) {
      for (var i = 0; i < gameState.played[color].length; i++) {
        var number = gameState.played[color][i].number;
        for (var p = 0; p < possibilities.length; p++) {
          if (number === possibilities[p].number && color === possibilities[p].color) {
            possibilities.splice(p, 1);
            p--;
            break;
          }
        }
      }
    }

    // remove discarded cards
    for (var i = 0; i < gameState.discard.length; i++) {
      for (var p = 0; p < possibilities.length; p++) {
        if (gameState.discard[i].number === possibilities[p].number && gameState.discard[i].color === possibilities[p].color) {
          possibilities.splice(p, 1);
          p--;
          break;
        }
      }
    }

    switch(oppositeHandKey) {
      case 'player':
        // looking at our own hand, using information from "oppositeHandKey"
        // which is the players hand
        for (var i = 0; i < gameState.player.length; i++) {
          for (var p = 0; p < possibilities.length; p++) {
            if (gameState.player[i].number === possibilities[p].number && gameState.player[i].color === possibilities[p].color) {
              possibilities.splice(p, 1);
              p--;
              break;
            }
          }
        }
        break;
      case 'computer':
        for (var i = 0; i < gameState.computer.length; i++) {
          for (var p = 0; p < possibilities.length; p++) {
            if (gameState.computer[i].isNumberKnown && gameState.computer[i].number === possibilities[p].number && gameState.computer[i].isColorKnown && gameState.computer[i].color === possibilities[p].color) {
              possibilities.splice(p, 1);
              p--;
              break;
            }
          }
        }
        break;
    }

    return possibilities;
  },

};

