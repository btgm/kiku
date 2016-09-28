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
  
  document.addEventListener('click', function (e) {
    if (e.target.nodeName === 'BUTTON') {      
        form.dataset.button = e.target.value;
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
    e.preventDefault();  
  });
  
})()