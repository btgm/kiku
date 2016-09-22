  'canDiscard': function(gameState, handKey, cardIndex) {
      var hand = gameState[handKey];
      var card = hand[cardIndex];

      // all possibilities
      var possibilities = [];
      for (var color in colors) {
        for (var number in numbers) {
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
        for (var number in gameState.played[color]) {
          for (var p = 0; p < possibilities.length; p++) {
            if (number === possibilities[p].number && color === possibilities[p].color) {
              possibilities.splice(p, 1);
              p--;
              break;
            }
          }
        }
      }

      // remove players cards
      for (var i = 0; i < gameState.player.length; i++) {
        for (var p = 0; p < possibilities.length; p++) {
          if (gameState.player[i].number === possibilities[p].number && gameState.player[i].color === possibilities[p].color) {
            possibilities.splice(p, 1);
            p--;
            break;
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

      console.log(possibilities);

      // of those possibilities, are any of these cards that _haven't_ been played
      // but are the last of their type?
      var badPossibilities = [];
      for (var p = 0; p < possibilities.length; p++) {
        // has been played?
        var played = false;
        for (var color in gameState.played) {
          for (var number in gameState.played[color]) {
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

      return badPossibilities.length/possibilities.length;
    },
