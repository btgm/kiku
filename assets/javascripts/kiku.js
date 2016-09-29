/***
 ===
 Kiku Card Game
 ===

Thanks: https://github.com/timruffles/ios-html5-drag-drop-shim
***/

(function(){
  var plays = document.querySelectorAll('input'),
      form = document.forms[0],
      httpRequest = new XMLHttpRequest();
  
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
  
  // ordinary click
  document.addEventListener('click', function (e) {
    if (e.target.nodeName === 'BUTTON' || e.target.parentNode.nodeName === 'BUTTON') {        
        var card = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
        console.log(card);
        form.dataset.button = card.value;        
    } 
        
    // listen for clicks to bring up discard and game log overlay   
    if (typeof e.target.dataset.show !== 'undefined') {      
      var overlayContent = document.getElementById( e.target.dataset.show ).outerHTML,
          overlay = document.getElementById('overlay');
          
          if (overlay.className == 'shown') {
            overlay.className = '';
            overlay.innerHTML = '';
          }else{
            overlay.innerHTML = overlayContent
            overlay.className = 'shown';
          }
          
      e.preventDefault();
    } 
    
    // Dismiss the overlay with a tap/click
    if (e.target.id === 'overlay') {      
      e.target.className='';
    } 
  })
    
  // after the POST request for a play is made do another
  // ajax call to update gamestate and alter board
   function handleGamePlay(){
    if (this.readyState == 4 && this.status == 200) {
      // console.log("Ajax call success! Calling game state to update...");
      // var httpRequest2 = new XMLHttpRequest();
      httpRequest.open('GET', '/board');
      httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
      httpRequest.send();
      httpRequest.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
          // Update the board with this data
          for (var id in response) {
            document.getElementById(id).innerHTML = response[id];
          }          
        }
      };      
    }
  };
      
  // ajax
  form.addEventListener('submit', function(e){
    var action = document.querySelector('input:checked').value;
    httpRequest.onreadystatechange = handleGamePlay;
    httpRequest.open('POST', '/gameplay');
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    httpRequest.send("action=" + action + "&card=" + form.dataset.button);    
    console.log(form.dataset.button);
    console.log(action);
    
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
 
 // cheat and show your cards
 var cheat = new Konami(function(){   
    var cards = document.querySelectorAll('#hand-player .card')
   for (var c=0; c < cards.length;c++) { cards[c].className += " color-known-true number-known-true";}
 });
 
  
})()