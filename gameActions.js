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

  'logDescriptively': function(gameState, handKey, message) {
    var subject = (handKey == 'computer ') ? 'The aliens' : 'You ';
    var quotes = [
      "Somewhere, something incredible is waiting to be known.",
      "For small creatures such as we the vastness is bearable only through love.",
      "Imagination will often carry us to worlds that never were. But without it we go nowhere.",
      "If you want to make an apple pie from scratch, you must first create the universe.",
      "For me, it is far better to grasp the Universe as it really is than to persist in delusion, however satisfying and reassuring.",
      "We're made of star stuff. We are a way for the cosmos to know itself.",
      "Absence of evidence is not evidence of absence.",
      "We are like butterflies who flutter for a day and think it is forever.",
      "Science is not only compatible with spirituality; it is a profound source of spirituality.",
      "We live in a society exquisitely dependent on science and technology, in which hardly anyone knows anything about science and technology.",
      "Perhaps we've never been visited by aliens because they have looked upon Earth and decided there's no sign of intelligent life.",
      "We are part of this universe; we are in this universe, but perhaps more important than both of those facts, is that the universe is in us.",
      "Science is basically an inoculation against charlatans.",
      "Life would be tragic if it weren't funny.",
      "Intelligence is the ability to adapt to change.",
      "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.",
      "Not only does God play dice, but... he sometimes throws them where they cannot be seen.",
      "We only have to look at ourselves to see how intelligent life might develop into something we wouldn’t want to meet."
    ]

    var quote = quotes[ Math.round( Math.random() * quotes.length ) ];

    if (handKey == 'player') {
      handKey = 'The earthlings ';
    }else{
      handKey = "The aliens ";
    }
    if (handKey == 'computer') subject == 'The aliens ';

    if (gameState.gameFinished == true) {
      message += ' The universe is a <a href="https://www.youtube.com/watch?v=V8AuYmID4wc">quiet, lonely place...</a>';
    }

    gameState.log.push(handKey + " " + message);
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

    this.logDescriptively(gameState, handKey, 'discarded card #' + (cardIndex+1) + ' which was a <span class="card-color ' + card.color + '">' + card.color + ' ' + card.number + '</span>.');

    return true;
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
      this.logDescriptively(gameState, handKey, 'successfully made contact with card #' + (cardIndex+1) + ' which was a <span class="card-color ' + card.color + '">' + card.color + ' ' + card.number + '</span>.');
    }
    else {
      // fail!

      gameState.fuseTokens--;

      if (gameState.fuseTokens < 1) {
        gameState.gameFinished = true;
        this.logDescriptively(gameState, handKey, 'played card #' + (cardIndex+1) + ' which was a <span class="card-color ' + card.color + '">' + card.color + ' ' + card.number + '</span> and ended the game.')
        return;
      }

      // put into the discard pile
      gameState.discard.push(card);
      this.logDescriptively(gameState, handKey, 'played card #' + (cardIndex+1) + ' which was a <span class="card-color ' + card.color + '">' + card.color + ' ' + card.number + '</span> unsuccessfully.');
    }

    // deal card from top of deck to replace in hand
    if (gameState.deck.length > 0) {
      hand.push(gameState.deck.pop());
    }else if (gameState.computer.length === 4 && gameState.player.length === 4) {
      gameState.gameFinished = false;
    }

    return true;
  },

  'tellNumber': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];
    var card = hand[cardIndex];
    var number = card.number * 1;

    if (gameState.timeTokens < 1) {
      this.logDescriptively(gameState, handKey, ' could not be informed about their ' + number + ' cards because all satellites have been used. Discard cards to free up satellites.');
      return false;
    }

    for (var h = 0; h < hand.length; h++) {
      if (hand[h].number == number) {
        hand[h].isNumberKnown = true;
      }
    }

    this.logDescriptively(gameState, handKey, ' were informed about all their ' + number + ' cards.');
    gameState.timeTokens--;

    return true;
  },

  'tellColor': function(gameState, handKey, cardIndex) {
    var hand = gameState[handKey];
    var card = hand[cardIndex];
    var color = card.color;

    if (gameState.timeTokens < 1) {
      this.logDescriptively(gameState, handKey, ' could not be informed about their <span class="card-color ' + card.color + '">' + color + '</span> cards because all satellites have been used. Discard cards to free up satellites.');
      return false;
    }

    for (var h = 0; h < hand.length; h++) {
      if (hand[h].color == color) {
        hand[h].isColorKnown = true;
      }
    }

    this.logDescriptively(gameState, handKey, 'were informed about all their <span class="card-color ' + card.color + '">' + color + ' cards</span>');
    gameState.timeTokens--;

    return true;
  },

  'calculateBestPlay': function(gameState, handKey) {
    var score = -1;
    var action;
    var cardIndex;

    for (var c = 0; c < gameState[handKey].length; c++) {
      if (gameState[handKey][c].canPlay > score) {
        score = gameState[handKey][c].canPlay;
        action = 'play';
        cardIndex = c;
      }
    }

    for (var c = 0; c < gameState[handKey].length; c++) {
      if (gameState[handKey][c].canDiscard > score) {
        score = gameState[handKey][c].canDiscard;
        action = 'discard';
        cardIndex = c;
      }
    }

    return { score: score, action: action, cardIndex: cardIndex, handKey: handKey };
  },

  'calculateTellBestPlay': function(gameState, actionKey) {
    var score = -1;
    var bestPlay;

    for (var c = 0; c < gameState.player.length; c++) {
      // if they already know the information for this card, then don't tell
      // them again
      var key = actionKey === 'tellNumber' ? 'isNumberKnown' : 'isColorKnown';
      if (gameState.player[c][key]) {
        continue;
      }

      var cloned = JSON.parse(JSON.stringify(gameState));
      this[actionKey](cloned, 'player', c);
      this.calculateBothHands(cloned);
      var play = this.calculateBestPlay(cloned, 'player');

      if (gameState.player[c].canDiscard !== 0 && cloned.player[c].canDiscard === 0 && score < 1) {
        score = 1;
        bestPlay = {
          play: play,
          score: 1,
          action: actionKey,
          handKey: 'player',
          cardIndex: c,
        };
        continue;
      }

      var improvesKnowledge = !bestPlay || gameState.player[c].canPlay > cloned.player[c].canPlay || gameState.player[c].canDiscard > cloned.player[c].canDiscard;
      var isHigherScore = play.score >= score;
      if (improvesKnowledge && isHigherScore) {
        score = play.score;
        bestPlay = {
          play: play,
          score: play.score,
          action: actionKey,
          handKey: 'player',
          cardIndex: c,
        };
        continue;
      }

    }

    return bestPlay;
  },

  'calculateComputerMove': function(gameState) {
    var plays = [];
    plays.push(this.calculateBestPlay(gameState, 'computer'));

    if (gameState.timeTokens > 0) {
      plays.push(this.calculateTellBestPlay(gameState, 'tellNumber'));
      plays.push(this.calculateTellBestPlay(gameState, 'tellColor'));
    }

    plays.sort(function(a, b) {
      return b.score - a.score;
    });
    bestPlay = plays[0];


    return bestPlay;
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
        continue;
      }

      // now check and see if it is a card we could play, because that would also not be ideal
      if (possibilities[p].number == 1+gameState.played[possibilities[p].color].length) {
        badPossibilities.push(possibilities[p]);
      }
    }

    //console.log(possibilities);
    //console.log(badPossibilities);

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

