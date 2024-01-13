counter = 0;
zoom = 1;
aspect = 0;
wh = 0;
ww = 0;
prev_w = 0;
prev_h = 0;









draw_maze=()=>{
    complx = document.querySelector('#complx').value*1;
    switch(complx){
        case 1:
            intr=[0,1,2,3,1,1,1,3,3,3];
            break;
        case 2:
            intr=[0,1,2,3,1,3];
            break;
        case 3:
            intr=[0,1,2,3,0,1,2,3];
            break;
    }
    seed=document.querySelector('#seed').value*1;
    seedRand(seed);
    
    canva = document.querySelector('#maze');
    ctx = canva.getContext("2d");
    ctx.fillStyle = "#000000";
    //ctx.fillRect(0, 0, 150, 75);
    nx=document.querySelector('#width').value*1;
    ny=document.querySelector('#height').value*1;
    maze = gen_maze(nx,ny,nx/2,ny/2);
    maze[0][1]=1;
    xStart=20.5;
    yStart=20.5;
    xSize=document.querySelector('#size').value*1;
    ySize=xSize;
    door=document.querySelector('#door');
    door.style.height=xSize*1.5 + "px";
    canva.width=nx*xSize+2*xStart;
    canva.height=ny*ySize+2*yStart;
    lineW=1;
    ctx.globalCompositeOperation="source-over";
    ctx.beginPath();
    ctx.lineWidth = lineW+1;
    ctx.strokeStyle = "rgba(0,0,0,1.0)";
    ctx.globalAlpha = 1;
    for(i=1;i<nx*2+1;i+=2){
        for(j=0;j<ny*2+1;j+=2){
            if(maze[i][j]==0){
                ctx.moveTo(xSize*(i-1)/2+xStart, ySize*(j)/2+yStart);
                ctx.lineTo(xSize*(i-1)/2+xStart+xSize, ySize*(j)/2+yStart);
            }
        }
    }
    for(i=0;i<nx*2+1;i+=2){
        for(j=1;j<ny*2+1;j+=2){
            if(maze[i][j]==0){
                ctx.moveTo(xSize*(i)/2+xStart, ySize*(j-1)/2+yStart);
                ctx.lineTo(xSize*(i)/2+xStart, ySize*(j-1)/2+yStart+ySize);
            }
        }
    }
    ctx.stroke();
    
};


play=()=>{
    
};

solve=()=>{
    
};




































document.addEventListener("DOMContentLoaded", (event) => {
    regenB=document.querySelector('#regen');
    regenB.addEventListener("click", (event) => {
        draw_maze();
    });
    playB=document.querySelector('#play');
    playB.addEventListener("click", (event) => {
        play();
    });
    solveB=document.querySelector('#solve');
    solveB.addEventListener("click", (event) => {
        solve();
    });
    
    seedI=document.querySelector('#seed').value=seed;
    
    dragElement(document.querySelector('#door'));
    draw_maze();
});







get_img_px = (img)=>{
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    var pixelData = canvas.getContext('2d').getImageData(img.width/2,img.height/1.8, 1, 1).data;
    return "rgba("+pixelData[0]+","+pixelData[1]+","+pixelData[2]+","+pixelData[3]+")";
}
clamp = (num, min, max) => {
    if (num == "NaN") {
        num = "0";
        return;
    }
    num = Math.max(0, num);
    num = Math.min(max, num);
    return num;
}

manage_anim = (event) => {
    let containers = document.querySelectorAll(".text");
    for (i = 0; i < containers.length; i++) {
        container = containers[i];

        let padding_left = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-left'));
        let padding_right = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-right'));
        let text = container.querySelector("span");
        if (container.clientWidth - padding_left - padding_right < text.clientWidth) {
            text.classList.add("animate");
        } else {
            text.classList.remove("animate");
        }
    }
}
resize_handle = (event) => {

    zoom = window.devicePixelRatio * 1;
    console.log(zoom);
    ww = window.innerWidth;
    wh = window.innerHeight;
    aspect = ww / wh;
    //console.log(aspect);
    let root = document.querySelector(":root");
    root.style.setProperty('--zoom', zoom);
    root.style.setProperty('--aspect', aspect);
    //----overflowing text-----
    manage_anim(event);
};
function stackCanvas(c1, c2) {

    d1 = c1.getImageData(0, 0, c1.canvas.width, c1.canvas.height).data;
    d2 = c2.getImageData(0, 0, c2.canvas.width, c2.canvas.height).data;
    if (d1.length != d2.length) {
        console.log((counter++) + "   not same size");
    }
    canva = document.createElement('canvas');
    cO = canva.getContext("2d");
    cO.fillRect(0, 0, c1.canvas.width, c1.canvas.height);
    dO = cO.getImageData(0, 0, c1.canvas.width, c1.canvas.height);
    for (i = 3; i < d1.length; i += 4) {
        a1 = d1[i];
        a2 = d2[i];
        r1 = d1[i - 1];
        r2 = d2[i - 1];
        g1 = d1[i - 2];
        g2 = d2[i - 2];
        b1 = d1[i - 3];
        b2 = d2[i - 3];

        a = a2;
        r = ((255 - a2) * r1 + a2 * r2) / 255;
        g = ((255 - a2) * g1 + a2 * g2) / 255;
        b = ((255 - a2) * b1 + a2 * b2) / 255;

        dO[i] = a;
        dO[i - 1] = r;
        dO[i - 2] = g;
        dO[i - 3] = b;
    }
    console.log(dO);
    cO.putImageData(dO, 0, 0);
    return cO;
}

onloadm = () => {
    //time=Date.now();
    //console.log(time+"   tz");
    ww = window.innerWidth;
    wh = window.innerHeight;
    prev_w = ww;
    prev_h = wh;
    window.setInterval(() => {
        manage_anim(event);
    }, 3000);
};
addEventListener("resize", resize_handle);
input_full = (event, ell) => {
    if (ell.value.length === parseInt(ell.attributes['maxlength'].value)) {
        try{
            ell.nextElementSibling.focus();
        }catch(e){
            maxlen=parseInt(ell.attributes['maxlength'].value);
            ell.value=ell.value.substring(0, maxlen);
        }
    }
}
input_empty = (event, ell) => {
    if (event.key === 'Backspace' && ell.value.length === 0) {
        ell.previousElementSibling.focus();
    }
}
filter_keys = (event, keys, ell) => {
    text = ell.value;
    tout = "";
    for (char of text) {
        if (keys.includes(char)) {
            tout += char
        }
    }
    ell.value = "";
    ell.value = tout;
}

filter_num_code = (event, ell) => {
    filter_keys(event, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], ell)
}
filter_num_clamp = (ell, min, max, step) => {
    num = Number(ell.value);
    ell.value = clamp(num, min, max, step);
}