dragBounds=[];
dragBounds["default"]=(x,y)=>{
    return {
        x:x,
        y:y
    };
};

function dragElement(elmnt,bounds, run) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.querySelector("#header")) {
    // if present, the header is where you move the DIV from:
    elmnt.querySelector("#header").onmousedown = dragMouseDown;
    elmnt.setAttribute("dragBounds", bounds);
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    elmnt.setAttribute("dragBounds", bounds);
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position: viewportOffset.top;
    var boundsName = e.view.door.getAttribute("dragBounds");
    var bounds=dragBounds[boundsName];
    if(bounds==null)bounds=dragBounds["default"];
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    var pos = bounds(
            (elmnt.offsetLeft - pos1),
            (elmnt.offsetTop - pos2));
    pos3 = pos.x - elmnt.offsetLeft + pos3/*e.clientX*/;
    pos4 = pos.y - elmnt.offsetTop + pos4/*e.clientY*/;
    // set the element's new position: /.getBoundingClientRect();
    elmnt.style.left = pos.x + "px";
    elmnt.style.top = pos.y + "px";
    run();
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}