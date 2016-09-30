/***
 ===
 Kiku Card Game
 ===

***/


(function(){
  var plays = document.querySelectorAll('input'),
      played = document.querySelectorAll('#played-cards > li'),
      form = document.forms[0],
      httpRequest = new XMLHttpRequest(),
      overlay = document.getElementById('overlay'),
      overlayText = document.getElementById('overlay-text'),
      notification =  document.getElementById('notification'),
      notificationTimeout;

  // Dropping cards on a play
  for(var p=0; p < plays.length;p++) {
    var play = plays[p];
    play.addEventListener('dragover', function(e){
      this.checked = true
      e.preventDefault();
    });

    // Make a play with dropped card by trigger click to submit the form
    play.addEventListener('drop', function(e){
      e.preventDefault();
      var card = e.dataTransfer.getData("card"),
          card_element = document.getElementsByClassName(card)[0];
          form.dataset.button = card_element.value;
          card_element.click();
    });
  }

  // Dragging a button to one of the plays
  document.addEventListener('dragstart', function (e) {
      if (e.target.nodeName === 'BUTTON') {
          e.dataTransfer.setData("card", e.target.className);
      }
  });

  // Because hovering is complicated sometimes
  function returnSpecificParent(el, id) {
    while (el.parentNode) {
      var previousElement = el;
      el = el.parentNode;
      if (el.id === id) return previousElement;
    }
    return null;
  }

  // Dragging card onto a stack to play
  document.addEventListener('dragenter', function(e){
    var el =  returnSpecificParent (e.target, 'played-cards');
    if ( el ) {
      el.className += ' hover-played';
      document.querySelector('input[value=play]').checked=true;
    }
  });

  document.addEventListener('dragover', function(e){
    var el = returnSpecificParent (e.target, 'played-cards');
    if ( el ) e.preventDefault();
  });

  document.addEventListener('dragleave', function(e){
    var el =  returnSpecificParent (e.target, 'played-cards');
    if ( el ) {
      el.className = el.className.replace(" hover-played", "");
    }
  });

  // Make a play with dropped card by trigger click to submit the form
  document.addEventListener('drop', function(e){
    if ( e.target.parentNode.id === 'played-cards' || e.target.parentNode.className == 'played-cards-stack') {
      e.preventDefault();
      var card = e.dataTransfer.getData("card"),
          card_element = document.getElementsByClassName(card)[0];
          form.dataset.button = card_element.value;
          card_element.click();
    }
  });



  // ordinary click
  document.addEventListener('click', function (e) {
    if (e.target.nodeName === 'BUTTON' || e.target.parentNode.nodeName === 'BUTTON') {
        var card = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
        form.dataset.button = card.value;
        form.dataset.color = card.className.match(/color\-(red|white|blue|green|yellow)/)[1]
        form.dataset.number = card.className.match(/number\-([1-5])/)[1]
    }

    // listen for clicks to bring up discard and game log overlay
    // looks for data attribute and uses content from element with
    // matching id, e.g., data-show='game-log'
    if (typeof e.target.dataset.show !== 'undefined') {
      var id = e.target.dataset.show,
          overlayContent = document.getElementById( id ).outerHTML;
          if (overlay.className == 'shown' && overlay.dataset.id === id) {
            // overlay.className = '';
            // overlayText.innerHTML = '';
          }else{
            overlayText.innerHTML = overlayContent
            overlay.className = 'shown';
            overlay.dataset.id = id;
          }

      e.preventDefault();
    }

    // Dismiss the overlay with a tap/click
    if (e.target.id === 'overlay' || e.target.className === 'overlay-dismiss' || e.target.dataset.dismiss ) {
      overlay.className = '';
      e.preventDefault();
    }

    // close the notification overlay
    if (e.target.id === 'notification') {
      notification.style.zIndex = -1;
      notification.className = "";
      clearTimeout(notificationTimeout);
      if (typeof window.speechSynthesis != 'undefined') {
        window.speechSynthesis.cancel();
      }
    }

    // read contents of the overlay outloud, if supported
    if (e.target.className === 'overlay-read' ) {
      kikuTalk(overlayText.innerText)
      e.preventDefault();
    }


  })

  // after the POST request for a play is made do another
  // ajax call to update gamestate and alter board
   function handleGamePlay(){
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      // Update the board with this data
      for (var id in response) {
        var el = document.getElementById(id)
        if (el !== null) {
          el.innerHTML = response[id];
        }
      }

      notification.style.zIndex = 1;
      notification.innerHTML = response['player-move-description'] + "<hr>" + response['computer-move-description'];
      notification.className = "show";

      var textToReat = notification.innerText;
      console.log(notification.innerText, textToReat.length);

      var duration = textToReat.length > 150 ? 14000 : 7500;
      // speak moves
      kikuTalk(textToReat);

      notificationTimeout = setTimeout(function(){
        notification.style.zIndex = -1;
        notification.className = "";
        if ( typeof window.speechSynthesis !== 'undefined' ) window.speechSynthesis.cancel();
      },duration);
    }
  };

  // ajax
  form.addEventListener('submit', function(e){
    var action = document.querySelector('input:checked').value;

    var color = form.dataset.color;
    var number = form.dataset.number;
    var description = "";

    httpRequest.onreadystatechange = handleGamePlay;
    httpRequest.open('POST', '/gameplay');
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    httpRequest.send("action=" + action + "&card=" + form.dataset.button);

    e.preventDefault();
  });



 /*
  * Konami-JS ~
  * :: Now with support for touch events and multiple instances for
  * :: those situations that call for multiple easter eggs!
  * Code: https://github.com/snaptortoise/konami-js
  * Examples: http://www.snaptortoise.com/konami-js
  * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
  * Version: 1.4.6 (3/2/2016)
  * Licensed under the MIT License (http://opensource.org/licenses/MIT)
  * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1 and Dolphin Browser
  */

 var Konami = function (callback) {
 	var konami = {
 		addEvent: function (obj, type, fn, ref_obj) {
 			if (obj.addEventListener)
 				obj.addEventListener(type, fn, false);
 			else if (obj.attachEvent) {
 				// IE
 				obj["e" + type + fn] = fn;
 				obj[type + fn] = function () {
 					obj["e" + type + fn](window.event, ref_obj);
 				}
 				obj.attachEvent("on" + type, obj[type + fn]);
 			}
 		},
 		input: "",
 		pattern: "38384040373937396665",
 		load: function (link) {
 			this.addEvent(document, "keydown", function (e, ref_obj) {
 				if (ref_obj) konami = ref_obj; // IE
 				konami.input += e ? e.keyCode : event.keyCode;
 				if (konami.input.length > konami.pattern.length)
 					konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
 				if (konami.input == konami.pattern) {
 					konami.code(link);
 					konami.input = "";
 					e.preventDefault();
 					return false;
 				}
 			}, this);
 			this.iphone.load(link);
 		},
 		code: function (link) {
 			window.location = link
 		},
 		iphone: {
 			start_x: 0,
 			start_y: 0,
 			stop_x: 0,
 			stop_y: 0,
 			tap: false,
 			capture: false,
 			orig_keys: "",
 			keys: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"],
 			code: function (link) {
 				konami.code(link);
 			},
 			load: function (link) {
 				this.orig_keys = this.keys;
 				konami.addEvent(document, "touchmove", function (e) {
 					if (e.touches.length == 1 && konami.iphone.capture == true) {
 						var touch = e.touches[0];
 						konami.iphone.stop_x = touch.pageX;
 						konami.iphone.stop_y = touch.pageY;
 						konami.iphone.tap = false;
 						konami.iphone.capture = false;
 						konami.iphone.check_direction();
 					}
 				});
 				konami.addEvent(document, "touchend", function (evt) {
 					if (konami.iphone.tap == true) konami.iphone.check_direction(link);
 				}, false);
 				konami.addEvent(document, "touchstart", function (evt) {
 					konami.iphone.start_x = evt.changedTouches[0].pageX;
 					konami.iphone.start_y = evt.changedTouches[0].pageY;
 					konami.iphone.tap = true;
 					konami.iphone.capture = true;
 				});
 			},
 			check_direction: function (link) {
 				x_magnitude = Math.abs(this.start_x - this.stop_x);
 				y_magnitude = Math.abs(this.start_y - this.stop_y);
 				x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
 				y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
 				result = (x_magnitude > y_magnitude) ? x : y;
 				result = (this.tap == true) ? "TAP" : result;

 				if (result == this.keys[0]) this.keys = this.keys.slice(1, this.keys.length);
 				if (this.keys.length == 0) {
 					this.keys = this.orig_keys;
 					this.code(link);
 				}
 			}
 		}
 	}

 	typeof callback === "string" && konami.load(callback);
 	if (typeof callback === "function") {
 		konami.code = callback;
 		konami.load();
 	}

 	return konami;
 };

 /***

   Cheat and show your cards

 ***/
 var cheat = new Konami(function(){
    var cards = document.querySelectorAll('#hand-player .card')
   for (var c=0; c < cards.length;c++) { cards[c].className += " color-known-true number-known-true";}
 });


 /***

   Close overlay if open when hitting escape

 ***/

 document.addEventListener('keydown', function(e){
   if (e.keyCode === 27) overlay.className = '';
 });


 /***

  Speech Synthesis capabilities

 **/

 var speech = false;

if (typeof SpeechSynthesisUtterance != 'undefined') {
  document.querySelector('.overlay-read').className='overlay-read';
}

function kikuTalk(text) {
  if (typeof SpeechSynthesisUtterance != 'undefined' ) {
    if ( typeof window.speechSynthesis !== 'undefined' ) window.speechSynthesis.cancel();
    speech =  new SpeechSynthesisUtterance();
    speech.onend = function(){};

   var speechSynthesis = window.speechSynthesis;
   speech.text = text;

   speechSynthesis.speak(speech);

   return true;
  }else{
    return false;
  }
}

})()
