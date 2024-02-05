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
    elmnt.querySelector("#header").onmousedown = dragMouseDown;
    elmnt.setAttribute("dragBounds", bounds);
  } else {
    elmnt.onmousedown = dragMouseDown;
    elmnt.setAttribute("dragBounds", bounds);
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    var viewportOffset = elmnt.parentElement.getBoundingClientRect();
    var boundsName = e.view.door.getAttribute("dragBounds");
    var bounds=dragBounds[boundsName];
    if(bounds==null)bounds=dragBounds["default"];
    var pos = bounds(
            (e.clientX - viewportOffset.left),
            (e.clientY - viewportOffset.top));
    elmnt.style.left = pos.x + "px";
    elmnt.style.top = pos.y + "px";
    run();
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}