!function(t){function e(e){e=e||{},l=navigator.userAgent.match(/OS [1-4](?:_\d+)+ like Mac/)?"page":"client";var r=t.createElement("div"),s="draggable"in r,i="ondragstart"in r&&"ondrop"in r,o=!(s||i)||/iPad|iPhone|iPod|Android/.test(navigator.userAgent);g((o?"":"not ")+"patching html5 drag drop"),o&&(e.enableEnterLeave||(a.prototype.synthesizeEnterLeave=h),t.addEventListener("touchstart",n))}function a(t,e){this.dragData={},this.dragDataTypes=[],this.dragImage=null,this.dragImageTransform=null,this.dragImageWebKitTransform=null,this.customDragImage=null,this.customDragImageX=null,this.customDragImageY=null,this.el=e||t.target,g("dragstart"),this.dispatchDragStart()&&(this.createDragImage(),this.listen())}function n(e){var n=e.target;do if(n.draggable===!0){if(!n.hasAttribute("draggable")&&"a"==n.tagName.toLowerCase()){var r=document.createEvent("MouseEvents");r.initMouseEvent("click",!0,!0,n.ownerDocument.defaultView,1,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,0,null),n.dispatchEvent(r),g("Simulating click to anchor")}e.preventDefault(),new a(e,n);break}while((n=n.parentNode)&&n!==t.body)}function r(e,a){var n=a.changedTouches[0],r=t.elementFromPoint(n[l+"X"],n[l+"Y"]);return r}function s(t){var e=t.getBoundingClientRect();return{x:e.left,y:e.top}}function i(t,e,a,n){return n&&(a=a.bind(n)),t.addEventListener(e,a),{off:function(){return t.removeEventListener(e,a)}}}function o(t,e,a,n){function r(n){return a(n),t.removeEventListener(e,r)}return n&&(a=a.bind(n)),t.addEventListener(e,r)}function d(t,e){if(1==t.nodeType){e.removeAttribute("id"),e.removeAttribute("class"),e.removeAttribute("style"),e.removeAttribute("draggable");for(var a=window.getComputedStyle(t),n=0;n<a.length;n++){var r=a[n];e.style.setProperty(r,a.getPropertyValue(r),a.getPropertyPriority(r))}e.style.pointerEvents="none"}if(t.hasChildNodes())for(var s=0;s<t.childNodes.length;s++)d(t.childNodes[s],e.childNodes[s])}function g(t){console.log(t)}function c(t){return 0===t.length?0:t.reduce(function(t,e){return e+t},0)/t.length}function h(){}g=h;var l;a.prototype={listen:function(){function e(t){this.dragend(t,t.target),a.call(this)}function a(){return g("cleanup"),this.dragDataTypes=[],null!==this.dragImage&&(this.dragImage.parentNode.removeChild(this.dragImage),this.dragImage=null,this.dragImageTransform=null,this.dragImageWebKitTransform=null),this.customDragImage=null,this.customDragImageX=null,this.customDragImageY=null,this.el=this.dragData=null,[n,r,s].forEach(function(t){return t.off()})}var n=i(t,"touchmove",this.move,this),r=i(t,"touchend",e,this),s=i(t,"touchcancel",a,this)},move:function(t){var e=[],a=[];[].forEach.call(t.changedTouches,function(t){e.push(t.pageX),a.push(t.pageY)});var n=c(e)-(this.customDragImageX||parseInt(this.dragImage.offsetWidth,10)/2),r=c(a)-(this.customDragImageY||parseInt(this.dragImage.offsetHeight,10)/2);this.translateDragImage(n,r),this.synthesizeEnterLeave(t)},translateDragImage:function(t,e){var a="translate("+t+"px,"+e+"px) ";null!==this.dragImageWebKitTransform&&(this.dragImage.style["-webkit-transform"]=a+this.dragImageWebKitTransform),null!==this.dragImageTransform&&(this.dragImage.style.transform=a+this.dragImageTransform)},synthesizeEnterLeave:function(t){var e=r(this.el,t);e!=this.lastEnter&&(this.lastEnter&&this.dispatchLeave(t),this.lastEnter=e,this.lastEnter&&this.dispatchEnter(t)),this.lastEnter&&this.dispatchOver(t)},dragend:function(e){g("dragend"),this.lastEnter&&this.dispatchLeave(e);var a=r(this.el,e);a?(g("found drop target "+a.tagName),this.dispatchDrop(a,e)):g("no drop target");var n=t.createEvent("Event");n.initEvent("dragend",!0,!0),this.el.dispatchEvent(n)},dispatchDrop:function(e,a){var n=t.createEvent("Event");n.initEvent("drop",!0,!0);var r=a.changedTouches[0],i=r[l+"X"],d=r[l+"Y"],c=s(e);n.offsetX=i-c.x,n.offsetY=d-c.y,n.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this),dropEffect:"move"},n.preventDefault=function(){}.bind(this),o(t,"drop",function(){g("drop event not canceled")},this),e.dispatchEvent(n)},dispatchEnter:function(e){var a=t.createEvent("Event");a.initEvent("dragenter",!0,!0),a.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this)};var n=e.changedTouches[0];a.pageX=n.pageX,a.pageY=n.pageY,a.clientX=n.clientX,a.clientY=n.clientY,this.lastEnter.dispatchEvent(a)},dispatchOver:function(e){var a=t.createEvent("Event");a.initEvent("dragover",!0,!0),a.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this)};var n=e.changedTouches[0];a.pageX=n.pageX,a.pageY=n.pageY,a.clientX=n.clientX,a.clientY=n.clientY,this.lastEnter.dispatchEvent(a)},dispatchLeave:function(e){var a=t.createEvent("Event");a.initEvent("dragleave",!0,!0),a.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this)};var n=e.changedTouches[0];a.pageX=n.pageX,a.pageY=n.pageY,a.clientX=n.clientX,a.clientY=n.clientY,this.lastEnter.dispatchEvent(a),this.lastEnter=null},dispatchDragStart:function(){var e=t.createEvent("Event");return e.initEvent("dragstart",!0,!0),e.dataTransfer={setData:function(t,e){return this.dragData[t]=e,this.dragDataTypes.indexOf(t)==-1&&(this.dragDataTypes[this.dragDataTypes.length]=t),e}.bind(this),setDragImage:function(t,e,a){this.customDragImage=t,this.customDragImageX=e,this.customDragImageY=a}.bind(this),dropEffect:"move"},this.el.dispatchEvent(e)},createDragImage:function(){this.customDragImage?(this.dragImage=this.customDragImage.cloneNode(!0),d(this.customDragImage,this.dragImage)):(this.dragImage=this.el.cloneNode(!0),d(this.el,this.dragImage)),this.dragImage.style.opacity="0.5",this.dragImage.style.position="absolute",this.dragImage.style.left="0px",this.dragImage.style.top="0px",this.dragImage.style.zIndex="999999";var e=this.dragImage.style.transform;"undefined"!=typeof e&&(this.dragImageTransform="","none"!=e&&(this.dragImageTransform=e.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g,"")));var a=this.dragImage.style["-webkit-transform"];"undefined"!=typeof a&&(this.dragImageWebKitTransform="","none"!=a&&(this.dragImageWebKitTransform=a.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g,""))),this.translateDragImage(-9999,-9999),t.body.appendChild(this.dragImage)}},e(window.iosDragDropShim)}(document),function(){function t(t){var e=new XMLHttpRequest;e.open("GET","/board/hand/"+t),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send(),e.onreadystatechange=function(){4==this.readyState&&200==this.status&&(document.getElementById("hand-"+t).innerHTML=this.responseText)}}function e(t){var e=new XMLHttpRequest;e.open("GET","/board/played/"),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send(),e.onreadystatechange=function(){4==this.readyState&&200==this.status&&(document.getElementById("played-cards").innerHTML=this.responseText)}}function a(){if(4==this.readyState&&200==this.status){var a=JSON.parse(this.responseText);console.log("Updated game state"),console.log(a),t("computer"),t("player"),e()}}function n(){4==this.readyState&&200==this.status&&(console.log("Ajax call success! Calling game state to update..."),i.open("GET","/gameplay/state"),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send(),i.onreadystatechange=a)}for(var r=document.querySelectorAll("input"),s=document.forms[0],i=new XMLHttpRequest,o=0;o<r.length;o++){var d=r[o];d.addEventListener("dragover",function(t){this.checked=!0,t.preventDefault()}),d.addEventListener("drop",function(t){t.preventDefault();var e=t.dataTransfer.getData("card"),a=document.getElementsByClassName(e)[0];s.dataset.button=a.value,a.click()})}document.addEventListener("dragstart",function(t){"BUTTON"===t.target.nodeName&&t.dataTransfer.setData("card",t.target.className)}),document.addEventListener("click",function(t){"BUTTON"===t.target.nodeName&&(s.dataset.button=t.target.value)}),s.addEventListener("submit",function(t){var e=document.querySelector("input:checked").value;i.onreadystatechange=n,i.open("POST","/gameplay"),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send("action="+e+"&card="+s.dataset.button),t.preventDefault()})}();