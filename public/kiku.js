!function(t){function e(e){e=e||{},l=navigator.userAgent.match(/OS [1-4](?:_\d+)+ like Mac/)?"page":"client";var r=t.createElement("div"),i="draggable"in r,s="ondragstart"in r&&"ondrop"in r,g=!(i||s)||/iPad|iPhone|iPod|Android/.test(navigator.userAgent);d((g?"":"not ")+"patching html5 drag drop"),g&&(e.enableEnterLeave||(a.prototype.synthesizeEnterLeave=c),t.addEventListener("touchstart",n))}function a(t,e){this.dragData={},this.dragDataTypes=[],this.dragImage=null,this.dragImageTransform=null,this.dragImageWebKitTransform=null,this.customDragImage=null,this.customDragImageX=null,this.customDragImageY=null,this.el=e||t.target,d("dragstart"),this.dispatchDragStart()&&(this.createDragImage(),this.listen())}function n(e){var n=e.target;do if(n.draggable===!0){if(!n.hasAttribute("draggable")&&"a"==n.tagName.toLowerCase()){var r=document.createEvent("MouseEvents");r.initMouseEvent("click",!0,!0,n.ownerDocument.defaultView,1,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,0,null),n.dispatchEvent(r),d("Simulating click to anchor")}e.preventDefault(),new a(e,n);break}while((n=n.parentNode)&&n!==t.body)}function r(e,a){var n=a.changedTouches[0],r=t.elementFromPoint(n[l+"X"],n[l+"Y"]);return r}function i(t){var e=t.getBoundingClientRect();return{x:e.left,y:e.top}}function s(t,e,a,n){return n&&(a=a.bind(n)),t.addEventListener(e,a),{off:function(){return t.removeEventListener(e,a)}}}function g(t,e,a,n){function r(n){return a(n),t.removeEventListener(e,r)}return n&&(a=a.bind(n)),t.addEventListener(e,r)}function o(t,e){if(1==t.nodeType){e.removeAttribute("id"),e.removeAttribute("class"),e.removeAttribute("style"),e.removeAttribute("draggable");for(var a=window.getComputedStyle(t),n=0;n<a.length;n++){var r=a[n];e.style.setProperty(r,a.getPropertyValue(r),a.getPropertyPriority(r))}e.style.pointerEvents="none"}if(t.hasChildNodes())for(var i=0;i<t.childNodes.length;i++)o(t.childNodes[i],e.childNodes[i])}function d(t){console.log(t)}function h(t){return 0===t.length?0:t.reduce(function(t,e){return e+t},0)/t.length}function c(){}d=c;var l;a.prototype={listen:function(){function e(t){this.dragend(t,t.target),a.call(this)}function a(){return d("cleanup"),this.dragDataTypes=[],null!==this.dragImage&&(this.dragImage.parentNode.removeChild(this.dragImage),this.dragImage=null,this.dragImageTransform=null,this.dragImageWebKitTransform=null),this.customDragImage=null,this.customDragImageX=null,this.customDragImageY=null,this.el=this.dragData=null,[n,r,i].forEach(function(t){return t.off()})}var n=s(t,"touchmove",this.move,this),r=s(t,"touchend",e,this),i=s(t,"touchcancel",a,this)},move:function(t){var e=[],a=[];[].forEach.call(t.changedTouches,function(t){e.push(t.pageX),a.push(t.pageY)});var n=h(e)-(this.customDragImageX||parseInt(this.dragImage.offsetWidth,10)/2),r=h(a)-(this.customDragImageY||parseInt(this.dragImage.offsetHeight,10)/2);this.translateDragImage(n,r),this.synthesizeEnterLeave(t)},translateDragImage:function(t,e){var a="translate("+t+"px,"+e+"px) ";null!==this.dragImageWebKitTransform&&(this.dragImage.style["-webkit-transform"]=a+this.dragImageWebKitTransform),null!==this.dragImageTransform&&(this.dragImage.style.transform=a+this.dragImageTransform)},synthesizeEnterLeave:function(t){var e=r(this.el,t);e!=this.lastEnter&&(this.lastEnter&&this.dispatchLeave(t),this.lastEnter=e,this.lastEnter&&this.dispatchEnter(t)),this.lastEnter&&this.dispatchOver(t)},dragend:function(e){d("dragend"),this.lastEnter&&this.dispatchLeave(e);var a=r(this.el,e);a?(d("found drop target "+a.tagName),this.dispatchDrop(a,e)):d("no drop target");var n=t.createEvent("Event");n.initEvent("dragend",!0,!0),this.el.dispatchEvent(n)},dispatchDrop:function(e,a){var n=t.createEvent("Event");n.initEvent("drop",!0,!0);var r=a.changedTouches[0],s=r[l+"X"],o=r[l+"Y"],h=i(e);n.offsetX=s-h.x,n.offsetY=o-h.y,n.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this),dropEffect:"move"},n.preventDefault=function(){}.bind(this),g(t,"drop",function(){d("drop event not canceled")},this),e.dispatchEvent(n)},dispatchEnter:function(e){var a=t.createEvent("Event");a.initEvent("dragenter",!0,!0),a.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this)};var n=e.changedTouches[0];a.pageX=n.pageX,a.pageY=n.pageY,a.clientX=n.clientX,a.clientY=n.clientY,this.lastEnter.dispatchEvent(a)},dispatchOver:function(e){var a=t.createEvent("Event");a.initEvent("dragover",!0,!0),a.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this)};var n=e.changedTouches[0];a.pageX=n.pageX,a.pageY=n.pageY,a.clientX=n.clientX,a.clientY=n.clientY,this.lastEnter.dispatchEvent(a)},dispatchLeave:function(e){var a=t.createEvent("Event");a.initEvent("dragleave",!0,!0),a.dataTransfer={types:this.dragDataTypes,getData:function(t){return this.dragData[t]}.bind(this)};var n=e.changedTouches[0];a.pageX=n.pageX,a.pageY=n.pageY,a.clientX=n.clientX,a.clientY=n.clientY,this.lastEnter.dispatchEvent(a),this.lastEnter=null},dispatchDragStart:function(){var e=t.createEvent("Event");return e.initEvent("dragstart",!0,!0),e.dataTransfer={setData:function(t,e){return this.dragData[t]=e,this.dragDataTypes.indexOf(t)==-1&&(this.dragDataTypes[this.dragDataTypes.length]=t),e}.bind(this),setDragImage:function(t,e,a){this.customDragImage=t,this.customDragImageX=e,this.customDragImageY=a}.bind(this),dropEffect:"move"},this.el.dispatchEvent(e)},createDragImage:function(){this.customDragImage?(this.dragImage=this.customDragImage.cloneNode(!0),o(this.customDragImage,this.dragImage)):(this.dragImage=this.el.cloneNode(!0),o(this.el,this.dragImage)),this.dragImage.style.opacity="0.5",this.dragImage.style.position="absolute",this.dragImage.style.left="0px",this.dragImage.style.top="0px",this.dragImage.style.zIndex="999999";var e=this.dragImage.style.transform;"undefined"!=typeof e&&(this.dragImageTransform="","none"!=e&&(this.dragImageTransform=e.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g,"")));var a=this.dragImage.style["-webkit-transform"];"undefined"!=typeof a&&(this.dragImageWebKitTransform="","none"!=a&&(this.dragImageWebKitTransform=a.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g,""))),this.translateDragImage(-9999,-9999),t.body.appendChild(this.dragImage)}},e(window.iosDragDropShim)}(document),function(){for(var t=document.querySelectorAll("input"),e=(document.querySelectorAll("button"),0);e<t.length;e++){var a=t[e];a.addEventListener("dragover",function(t){this.checked=!0,t.preventDefault()}),a.addEventListener("drop",function(t){t.preventDefault();var e=t.dataTransfer.getData("card");document.getElementsByClassName(e)[0].click()})}document.addEventListener("dragstart",function(t){"BUTTON"===t.target.nodeName&&(console.log("Dragging",t.target.className),t.dataTransfer.setData("card",t.target.className))})}();