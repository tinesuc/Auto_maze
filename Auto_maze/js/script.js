counter = 0;
zoom = 1;
aspect = 0;
wh = 0;
ww = 0;
prev_w = 0;
prev_h = 0;
mover = new AbortController();
a_chomp = new Audio('aud/chomp2.wav');
a_chomp2 = new Audio('aud/chomp2.wav');
//a_chomp = new Audio('aud/pacman_chomp.wav');
a_chomp.volume=0.10;
a_chomp2.volume=0.10;
a_eat = new Audio('aud/eatfruit.wav');
a_eat2 = new Audio('aud/eatfruit.wav');
a_eat.volume=0.15;
a_eat2.volume=0.15;
paci = document.createElement('img');
paci.setAttribute("src","img/pcm1.png");
pac = document.createElement("canvas").getContext("2d");
dotList=[];
/*paci.onload = function (){
   
    pac.drawImage(paci,0,0,paci.width,paci.height);
    console.log( pac.constructor.name);
};*/


get_px = (ctx, x, y)=>{
    return ctx.getImageData(x,y, 1, 1).data;
};

clamp = (num, min, max) => {
    if (num == "NaN") {
        num = min;
        return;
    }
    num = Math.max(min, num);
    num = Math.min(max, num);
    return num;
};

doorHandle=()=>{
    var spp=spos;
    Object.assign(spp, spos);
    var dpx=Math.round((door.style.left.substring(0,door.style.left.length-2)*1+dSize/2-xStart)/xSize-0.5)*2+1;
    var dpy=Math.round((door.style.top.substring(0,door.style.top.length-2)*1+dSize/2-yStart)/xSize-0.5)*2+1;
    spos={x:dpx,y:dpy};
    
    
};

function concloader(i, para, pd){
    if(i>=langlist.length){
        translate(document, lang[pd]);
        return;
    }
    var lid=langlist[i];
    var url = "js/lang_"+lid+".json";
    
    var par = document.createElement("object");
    par.setAttribute('data', url);
    para.appendChild(par);
    par.onload = function() {
        var doc = par.contentDocument || par.contentWindow.document;
        var data = doc.body.childNodes[0].innerHTML;
        lang[lid] = JSON.parse(data);
        concloader(i+1,para,pd);
    };
}

draw_maze=()=>{
    
    bl=true;
    var zz = document.getElementById('p1');
    var para = document.createElement("div");
    zz.appendChild(para);
    
    concloader(0,para,"en");
    
    document.querySelector("#p1").appendChild(paci);
    
    
    canva = document.querySelector('#maze');
    anim = document.querySelector('#anim');
    ctx = canva.getContext("2d");
    ctx2 = anim.getContext("2d");
    xStart=20.5;
    yStart=20.5;
    complx = document.querySelector('#complx');
    seedl=document.querySelector('#seed');
    widthEl=document.querySelector('#width');
    heightEl=document.querySelector('#height')
    sizeEl=document.querySelector('#size');
    
    
    
    regen();
    
    
    var pos=dragBounds["edge"](0,0);
    var door=document.querySelector('#door');
    dragElement(door,"edge", doorHandle);
    door.style.left = pos.x + "px";
    door.style.top = pos.y + "px";
    
//    var w=widthEl.value*1;
//    var h=heightEl.value*1;
//    var arr = new Array(w*2+1);
//    for (var i = 0; i < arr.length; i++) {
//        arr[i] = new Array(h*2+1);
//        arr[i].fill(0);
//    }
////    for(var i=xStart;i<xSize*w+xStart;i+=xSize/2){
////        for(var j=yStart;j<xSize*h+yStart;j+=xSize){
//    for(var i=0;i<w*2+1;i++){
//        for(var j=0;j<h*2+1;j++){
//            var wi=xStart+xSize/2*i;
//            var hj=yStart+xSize/2*j;
//            var cl=get_px(ctx,wi,hj);
//            if(cl[3]!=0){
//                arr[i][j]=1;
//                //console.log(i+"  "+j);
//                console.log(cl);
//            }
//        }
//    }
    //console.log(arr);
    
};
reset = ()=>{
    solved=false;
    solving=false;
    playing=false;
    dtclr=false;
    for (var i=0; i<timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts=[];
    draw_dt_delay=200;
    sr_depth=0;
    sr_depth2=0;
    hintTime=0;
   
    mover.abort();
};

regen=()=>{
    reset();
    
    switch(complx.value*0.1){
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
    if(seedl.value.length==0){
        seedl.value=Date.now();
    }
    seed=seedl.value;
    seedRand(seed);
    
    ctx.fillStyle = "#000000";
    //ctx.fillRect(0, 0, 150, 75);
    nx=widthEl.value*1;
    ny=heightEl.value*1;
    
    maze = gen_maze(nx,ny,nx/2,ny/2);
    epos={x:maze.length-2,y:maze[0].length-2};
    maze[epos.x][epos.y+1]=1;
    
    xSize=sizeEl.value*1;
    if(xSize==4){
        var wid=window.innerWidth/2.4;
        var szx= Math.round(wid/nx);
        var hei=window.innerHeight/1.5;
        var szy= Math.round(hei/ny);
        xSize=Math.min(szx,szy);
    }
    ySize=xSize;
    door=document.querySelector('#door');
    dSize=xSize/1.3;//window.innerHeight/40;
    dSize = clamp(dSize, 5, 50);
    door.style.height=dSize + "px";
    
    
    /*
    door.style.left = pos.x + "px";
    door.style.top = pos.y + "px";*/
    
    //cw=nx*xSize+2*xStart;
    canva.width=cw=nx*xSize+2*xStart;
    canva.height=ch=ny*ySize+2*yStart;
    anim.width=cw=nx*xSize+2*xStart;
    anim.height=ch=ny*ySize+2*yStart;
    
    dragBounds["edge"]=(x,y)=>{
        //dSize/2
        x=clamp(x,xStart+xSize/2,cw-xStart-xSize);
        y=clamp(y,yStart+xSize/2,ch-yStart-xSize);
        var xt=(x-xStart);
        var yt=(y-yStart);
        x=xt-xt%xSize+xSize/2-dSize/2 +xStart;
        y=yt-yt%xSize+xSize/2-dSize/2 +yStart;
        return {
            x:x,
            y:y
        };
    };
    var viewportOffset = door.parentElement.getBoundingClientRect();
    var viewportOffsetd = door.getBoundingClientRect();
    var bounds=dragBounds["edge"];
    var dpos = bounds(
            (viewportOffsetd.left - viewportOffset.left),
            (viewportOffsetd.top - viewportOffset.top));
    door.style.left = dpos.x + "px";
    door.style.top = dpos.y + "px";
    
    lineW=1;
    ctx.globalCompositeOperation="source-over";
    ctx.beginPath();
    ctx.lineWidth = lineW+1;
    ctx.strokeStyle = "#0033ff";
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

rad=0;
span=0;
tm=0;
x=0;
y=0;
solving=false;
hintTime=0;
move = (e) => {
    const key=e.key;
    ctx2.imageSmoothingEnabled = false;
    //ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    ctx2.clearRect(x, y, xSize*0.8,xSize*0.8);
    switch(key){
        case "h":case "H":
            if(!solving&&Date.now()-hintTime>3000){
                hintTime=Date.now();
                playing=true;
                speed=document.querySelector('#speed').value*1;
                draw_dt_delay=200;
                sr_depth=0;
                sr_depth2=0;
                search_maze(maze, pos,epos ,{ctx:ctx2,xSize:xSize,xStart:xStart,yStart:yStart,ySize:ySize,t:speed,b:true,mz:maze});
                playing=false;
            }
        
            break;
        case "w":case "W":case "ArrowUp":
            if(pos.y>1&&maze[pos.x][pos.y-1]!=0){
                pos.x+=+0;
                pos.y+=-2;
                //tm++;
                rad = -90*Math.PI/180;

                console.log("ww");
            }

            break;
        case "s":case "S":case "ArrowDown":
            if(pos.y<maze[0].length-2&&maze[pos.x][pos.y+1]!=0){
                pos.x+=+0;
                pos.y+=+2;
                //tm++;
                rad = 90*Math.PI/180;


                console.log("ss");
            }


            break;
        case "a":case "A":case "ArrowLeft":
            if(pos.x>1&&maze[pos.x-1][pos.y]!=0){
                pos.x+=-2;
                pos.y+=+0;

                //tm++;
                rad = 180*Math.PI/180;


                console.log("aa");
            }


            break;
        case "d":case "D":case "ArrowRight":
            if(pos.x<maze.length-2&&maze[pos.x+1][pos.y]!=0){
                pos.x+=+2;
                pos.y+=+0;

                //tm++;
                rad = 0*Math.PI/180;


                console.log("dd");
            }

            break;
    }
    var isDot=false;
    for(var i=0;i<dotList.length;i++){
        if(dotList[i].x==pos.x&&dotList[i].y==pos.y){
            isDot=true;
            break;
        }
    }
    if(isDot&&solving){
        a_eat.play();
        tmp_eat=a_eat;
        a_eat=a_eat2;
        a_eat2=tmp_eat;
    }
    
    x = ((pos.x-1)/2*xSize+xStart+xSize*0.1) ;
    y = ((pos.y-1)/2*xSize+yStart+xSize*0.1) ;
    ctx2.clearRect(x, y, xSize*0.8,xSize*0.8);

    roffs = 0.15;
    span = Math.sin(tm*Math.PI*0.5)*roffs*Math.PI;
    pac.clearRect(0, 0, pac.canvas.width, pac.canvas.height);
    pac.beginPath();
    pac.arc(16, 16, 16, roffs*Math.PI+rad+span , (2-roffs)*Math.PI+rad-span);
    pac.lineTo(16,16);
    pac.lineTo(16+8*Math.cos(roffs*Math.PI+rad+span),16+8*Math.sin(roffs*Math.PI+rad+span));
    pac.fillStyle = "#f4f400";
    pac.strokeStyle = "#f4f400";
    pac.stroke();
    pac.fill();
    ctx2.drawImage(pac.canvas,x, y, xSize*0.8,xSize*0.8);
    
    if(pos.x==epos.x&&pos.y==epos.y){
        setTimeout(()=>{
            if(!solving){
                reset();
                var nm = document.querySelector(".switch-toggle > input:checked").getAttribute("id");
                Swal.fire({
                    title: '<strong style="color:#dcdc38;">'+lang[nm].win+'</strong>',
                    imageUrl:"img/fireworks.gif",
                    showCloseButton: true,
                    focusConfirm: true,
                    background:"#101010",
                    confirmButtonText: lang[nm].try_again,
                    confirmButtonColor: '#0033ff',
                    didOpen: () => Swal.getConfirmButton().focus()
                }).then((result) => {
                    if (result.isConfirmed) {
                        play();
                    }
                })
            }else{
                reset();
            }
        },200);
    }
    /* 
    Swal.fire({
        title: "Sweet!",
        text: "Modal with a custom image.",
        imageUrl: "https://unsplash.it/400/200",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      });

    */
}

pos={};
play=()=>{
    reset();
    mover = new AbortController();
    Object.assign(pos,spos);//<-------
    //pac.translate(pac.canvas.width/2, pac.canvas.height/2);
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    pac.canvas.width=32;
    pac.canvas.height=32;
    pac.beginPath();
    pac.arc(16, 16, 16, 0.1875*Math.PI, (2-0.1875)*Math.PI);
    pac.lineTo(16,16);
    pac.lineTo(16+8*Math.cos(0.1875*Math.PI),16+8*Math.sin(0.1875*Math.PI));
    pac.fillStyle = "#f4f400";
    pac.strokeStyle = "#f4f400";
    pac.stroke();
    pac.fill();
    //ctx2.drawImage(pac.canvas,xStart+xSize*0.1, yStart+xSize*0.1, xSize*0.8,xSize*0.8);
    rad=0;
    span=0;
    tm=0;
    x=0;
    y=0;
    
    aud_time=0;
    timeouts.push(setInterval(()=>{
        //ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
        tm++;
        aud_time++;
        if(aud_time%4===0){
            a_chomp.play();
            tmp_chomp=a_chomp;
            a_chomp=a_chomp2;
            a_chomp2=tmp_chomp;
        }
        x = ((pos.x-1)/2*xSize+xStart+xSize*0.1) ;
        y = ((pos.y-1)/2*xSize+yStart+xSize*0.1) ;
        ctx2.clearRect(x, y, xSize*0.8,xSize*0.8);

        roffs = 0.15;
        span = Math.sin(tm*Math.PI*0.5)*roffs*Math.PI;
        pac.clearRect(0, 0, pac.canvas.width, pac.canvas.height);
        pac.beginPath();
        pac.arc(16, 16, 16, roffs*Math.PI+rad+span , (2-roffs)*Math.PI+rad-span);
        pac.lineTo(16,16);
        pac.lineTo(16+8*Math.cos(roffs*Math.PI+rad+span),16+8*Math.sin(roffs*Math.PI+rad+span));
        pac.fillStyle = "#f4f400";
        pac.strokeStyle = "#f4f400";
        pac.stroke();
        pac.fill();

        ctx2.drawImage(pac.canvas,x, y, xSize*0.8,xSize*0.8);
        
    },75));
    
    document.addEventListener("keydown", move, {signal: mover.signal});
    
};







solve=()=>{
    reset();
    if(solved)return;
    speed=document.querySelector('#speed').value*1;
    console.log(maze);
    complete=false;
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    search_maze(maze, spos,epos ,{ctx:ctx2,xSize:xSize,xStart:xStart,yStart:yStart,ySize:ySize,t:speed,b:true,mz:maze});
    for(i=0;i<maze.length;i++){
        for(j=0;j<maze[i].length;j++){
            var v=maze[i][j];
            if(v==2){
                maze[i][j]=1;
            }
        }
    }
    pac.canvas.width=32;
    pac.canvas.height=32;
    ct=0;
    console.log(sr_depth*speed+" t "+draw_dt_delay+200+"  "+timeo+"  "+sr_depth2*speed);
    timeouts.push(setTimeout(()=>{
        console.log(dotList);
        //return;
        ppos={};
        Object.assign(ppos,spos);
        Object.assign(pos,spos);
        aud_time=0;
        solving=true;
        var loop = setInterval(()=>{
            //ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
            tm++;
            aud_time++;
            if(aud_time%4===0){
                a_chomp.play();
                tmp_chomp=a_chomp;
                a_chomp=a_chomp2;
                a_chomp2=tmp_chomp;
                
                ct++;
                if(ct-100>maze.length*maze[0].length)return;
                var xt= pos.x;
                var yt= pos.y;
                //console.log(pos);
                for(i=0;i<4;i++){
                    var xc=xt+dir[i][0];
                    var yc=yt+dir[i][1];
                //console.log(" xc:"+xc+"  "+yc);
                    if(0<xc&&xc<maze.length&&0<yc&&yc<maze[0].length){
                            //console.log(" mz:"+maze[xc][yc]);
                        if(!(ppos.x==xc&&ppos.y==yc)&&(maze[xc][yc]===3||maze[xc][yc]===7)){
                            var xh=xt+dirh[i][0];
                            var yh=yt+dirh[i][1];
                            if(maze[xh][yh]===1){
                                var k="";
                                switch(i){
                                    case 0:k="s";break;
                                    case 1:k="d";break;
                                    case 2:k="w";break;
                                    case 3:k="a";break;
                                }

                                //console.log(k);
                                ppos={x:pos.x,y:pos.y};
                                move({key:k});
                                if(epos.x==xc&&epos.y==yc)clearTimeout(loop);
                                pos={x:xc,y:yc};
//                                console.log(" p:");
//                                console.log(ppos);
//                                console.log(" s:");
//                                console.log(pos);
                                break;

                            }
                        }
                    }
                }
                
                
            }
            x = ((pos.x-1)/2*xSize+xStart+xSize*0.1) ;
            y = ((pos.y-1)/2*xSize+yStart+xSize*0.1) ;
            ctx2.clearRect(x, y, xSize*0.8,xSize*0.8);
            
            roffs = 0.15;
            span = Math.sin(tm*Math.PI*0.5)*roffs*Math.PI;
            pac.clearRect(0, 0, pac.canvas.width, pac.canvas.height);
            pac.beginPath();
            pac.arc(16, 16, 16, roffs*Math.PI+rad+span , (2-roffs)*Math.PI+rad-span);
            pac.lineTo(16,16);
            pac.lineTo(16+8*Math.cos(roffs*Math.PI+rad+span),16+8*Math.sin(roffs*Math.PI+rad+span));
            pac.fillStyle = "#f4f400";
            pac.strokeStyle = "#f4f400";
            pac.stroke();
            pac.fill();
            ctx2.drawImage(pac.canvas,x, y, xSize*0.8,xSize*0.8);
            
        }, 75);
        timeouts.push(loop);
    }
    ,sr_depth*speed+2*draw_dt_delay+200-sr_depth2*speed));
   
    
    
    
    solved=true;
    /*
    ctx2.fillStyle = "#00ff00";
    for(i=1;i<nx*2+1;i+=2){
        for(j=1;j<ny*2+1;j+=2){
            if(maze[i][j]==3){
                ctx2.fillRect(xSize*(i-1)/2+xStart+1,
                            ySize*(j-1)/2+yStart+1,
                            xSize-2, ySize-2);
                //ctx.moveTo(xSize*(i-1)/2+xStart, ySize*(j)/2+yStart);
                //ctx.lineTo(xSize*(i-1)/2+xStart+xSize, ySize*(j)/2+yStart);
            }
        }
    }
    ctx2.fillStyle = "#ffff00";
    for(i=1;i<nx*2+1;i+=2){
        for(j=1;j<ny*2+1;j+=2){
            if(maze[i][j]==2){
                ctx2.fillRect(xSize*(i-1)/2+xStart+1,
                            ySize*(j-1)/2+yStart+1,
                            xSize-2, ySize-2);
                //ctx.moveTo(xSize*(i-1)/2+xStart, ySize*(j)/2+yStart);
                //ctx.lineTo(xSize*(i-1)/2+xStart+xSize, ySize*(j)/2+yStart);
            }
        }
    }*/
};



function incs(ell){
    var val = ell.value*1;
    var nm = document.querySelector(".switch-toggle > input:checked").getAttribute("id");
    if(val==4){
        val="$auto$";
    }
    var txt = ell.closest("li").querySelector(".trs");
    txt.setAttribute("trval","val:"+val);
    translate(txt, lang[nm]);
}
function innm(ell){
    var nm = document.querySelector(".switch-toggle > input:checked").getAttribute("id");
    var val = ell.value*1;
    var txt = ell.closest("li").querySelector(".trs");
    txt.setAttribute("trval","val:"+val);
    translate(txt, lang[nm]);
}
function incx(ell){
    var nm = document.querySelector(".switch-toggle > input:checked").getAttribute("id");
    var val = Math.round(ell.value*0.1);
    var txt = ell.closest("li").querySelector(".trs");
    txt.setAttribute("trval","val:"+val);
    translate(txt, lang[nm]);
}

function mswitch(ell){
    setTimeout(()=>{
        var inp = ell.querySelector("input:checked");
        var nm = inp.getAttribute("id");
        translate(document, lang[nm]);
    },10);
}




























document.addEventListener("DOMContentLoaded", (event) => {
    regenB=document.querySelector('#regen');
    regenB.addEventListener("click", (event) => {
        regen();
    });
    playB=document.querySelector('#play');
    playB.addEventListener("click", (event) => {
        play();
    });
    solveB=document.querySelector('#solve');
    solveB.addEventListener("click", (event) => {
        solve();
    });
    
    
    draw_maze();
});








manage_anim = (event) => {
    let containers = document.querySelectorAll(".text");
    for (i = 0; i < containers.length; i++) {
        var container = containers[i];

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
    ww = window.innerWidth;
    wh = window.innerHeight;
    aspect = ww / wh;
    let root = document.querySelector(":root");
    root.style.setProperty('--zoom', zoom);
    root.style.setProperty('--aspect', aspect);
    //----overflowing text-----
    manage_anim(event);
};
function stackCanvas(c1, c2) {

    var d1 = c1.getImageData(0, 0, c1.canvas.width, c1.canvas.height).data;
    var d2 = c2.getImageData(0, 0, c2.canvas.width, c2.canvas.height).data;
    if (d1.length != d2.length) {
        console.log((counter++) + "   not same size");
    }
    var canva = document.createElement('canvas');
    var cO = canva.getContext("2d");
    cO.fillRect(0, 0, c1.canvas.width, c1.canvas.height);
    var dO = cO.getImageData(0, 0, c1.canvas.width, c1.canvas.height);
    for (i = 3; i < d1.length; i += 4) {
        var a1 = d1[i];
        var a2 = d2[i];
        var r1 = d1[i - 1];
        var r2 = d2[i - 1];
        var g1 = d1[i - 2];
        var g2 = d2[i - 2];
        var b1 = d1[i - 3];
        var b2 = d2[i - 3];

        var a = a2;
        var r = ((255 - a2) * r1 + a2 * r2) / 255;
        var g = ((255 - a2) * g1 + a2 * g2) / 255;
        var b = ((255 - a2) * b1 + a2 * b2) / 255;

        dO[i] = a;
        dO[i - 1] = r;
        dO[i - 2] = g;
        dO[i - 3] = b;
    }
    cO.putImageData(dO, 0, 0);
    return cO;
}

onloadm = () => {
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
            var maxlen=parseInt(ell.attributes['maxlength'].value);
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
    var text = ell.value;
    var tout = "";
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
    var num = Number(ell.value);
    ell.value = clamp(num, min, max, step);
};




