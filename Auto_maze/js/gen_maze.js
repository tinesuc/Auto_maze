
dir=[
    [0,2],
    [2,0],
    [0,-2],
    [-2,0]
];
dirh=[
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
];
intr=[0,1,2,3,0,1,2,3];

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function sfc32(a, b, c, d) {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0; 
      var t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    };
}
seed=Date.now();
rand=()=>{};

function seedRand(seed1){
    seed=seed1;
    rand = sfc32(seed,seed,seed,seed);
}
seedRand(seed);
function getRandomInt(max) {
  return Math.floor(rand() * max);
}
inrange=(x, min,max)=>{
    return min<x<max;
};
rerand=(arr)=>{
    var len = arr.length;
    var rd=0;
    var tmp=0;
    var lc = [...arr];
    for(var i=0;i<len;i++){
        rd=getRandomInt(len);
        tmp=lc[rd];
        lc[rd]=lc[i];
        lc[i]=tmp;
    }
    return lc;
};
chosenext=(mz, x, y )=>{
    var lc=rerand(intr);
    mz[x][y]=1;
    var i=0;
    for(;i<lc.length;i++){
        var xc=x+dir[lc[i]][0];
        var yc=y+dir[lc[i]][1];
        if(0<xc&&xc<mz.length&&0<yc&&yc<mz[0].length){
            if(mz[xc][yc]===0){
                var xh=x+dirh[lc[i]][0];
                var yh=y+dirh[lc[i]][1];
                mz[xh][yh]=1;
                chosenext(mz,xc,yc);
            }
        }
    }
    return mz;
};

gen_maze=(w,h,x,y)=>{
    x=x-x%1;
    y=y-y%1;
    var arr = new Array(w*2+1);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(h*2+1);
        arr[i].fill(0);
    }
    arr = chosenext(arr,x*2+1,y*2+1);
    return arr;
};


timeo=0;
dtclr=false;
function drawYellow (spos,v){
    dtclr=false;
    v.ctx.fillStyle = "#ffff8080";
    v.ctx.fillRect(v.xSize*(spos.x-1)/2+v.xStart+1,
        v.ySize*(spos.y-1)/2+v.yStart+1,
        v.xSize-2, v.ySize-2);
};
function drawGreen (spos,v){
    v.ctx.fillStyle = "#80ff8080";
    v.ctx.fillRect(v.xSize*(spos.x-1)/2+v.xStart+1,
        v.ySize*(spos.y-1)/2+v.yStart+1,
        v.xSize-2, v.ySize-2);
};
function drawDot (spos,v){
    if(!dtclr){
        dtclr=true;
        v.ctx.clearRect(0, 0, v.ctx.canvas.width, v.ctx.canvas.height);
    }
    if(getRandomInt(100)<15){
        v.mz[spos.x][spos.y]=7;
        dotList.push({x:spos.x,y:spos.y});
        v.ctx.fillStyle = "rgb(253, 255, 171)";
        v.ctx.strokeStyle = "rgb(253, 255, 171)";
        v.ctx.beginPath();
        v.ctx.arc(v.xSize*(spos.x-1)/2+v.xStart+1+(v.xSize-2)/2,
            v.ySize*(spos.y-1)/2+v.yStart+1+(v.ySize-2)/2,
            (v.xSize-2)/6,
            0, 2 * Math.PI);
        v.ctx.fill();
        v.ctx.stroke();
    }
};

search_maze=(mz, spos, epos, v)=>{
    if(v.b){
        timeo=0;
        v.b=false;
    }
    mz[spos.x][spos.y]=2;
    timeouts.push(setTimeout(()=>drawYellow(spos,v),timeo));
    sr_depth2++;
    timeo+=v.t;
    if(spos.x==epos.x&&spos.y==epos.y){
        mz[epos.x][epos.y]=3;
        timeouts.push(setTimeout(()=>drawGreen(spos,v),timeo));
        timeo+=v.t;
        draw_dt_delay=draw_dt_delay+sr_depth2*v.t + sr_depth*v.t;
        return 1;
    }
    for(var i=0;i<4;i++){
        var xc=spos.x+dir[i][0];
        var yc=spos.y+dir[i][1];
        if(0<xc&&xc<mz.length&&0<yc&&yc<mz[0].length){
            var wl = mz[spos.x+dirh[i][0]][spos.y+dirh[i][1]];
            var fw = mz[xc][yc];
            if(wl==1&&(fw==1||fw==3||fw==7)){
                sr_depth++;
                if(search_maze(mz,{x:xc,y:yc},epos,v)==1){
                    mz[spos.x][spos.y]=3;
                    timeouts.push(setTimeout(()=>drawDot(spos,v),sr_depth*v.t+draw_dt_delay));
                    timeouts.push(setTimeout(()=>drawGreen(spos,v),timeo));
                    //(timeo - sr_depth2*v.t) 
                    sr_depth--;
                    timeo+=v.t;
                    return 1;
                }
                sr_depth--;
            }
        }
    }
    return 0;
};