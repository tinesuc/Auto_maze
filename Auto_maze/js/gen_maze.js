
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
    len = arr.length;
    rd=0;
    tmp=0;
    lc = [...arr];
    for(var i=0;i<len;i++){
        rd=getRandomInt(len);
        tmp=lc[rd];
        lc[rd]=lc[i];
        lc[i]=tmp;
    }
    return lc;
};
chosenext=(mz, x, y )=>{
    //use array 0-3, reorder, iterate
    var lc=rerand(intr);
    //console.log(mz);
    //console.log(lc+"   h");
    mz[x][y]=1;
    var i=0;
    for(;i<lc.length;i++){
        var xc=x+dir[lc[i]][0];
        var yc=y+dir[lc[i]][1];
        //console.log(xc+"  "+yc+" | "+lc+" . "+i);
        if(0<xc&&xc<mz.length&&0<yc&&yc<mz[0].length){
            //console.log(xc+"  "+yc+"  "+i+"  "+mz[xc][yc]);
            if(mz[xc][yc]===0){
                var xh=x+dirh[lc[i]][0];
                var yh=y+dirh[lc[i]][1];
                mz[xh][yh]=1;
                chosenext(mz,xc,yc);
                //console.log(xc+"  "+yc+" || "+lc);
            }
        }
        //console.log(i);
    }
    return mz;
};

gen_maze=(w,h,x,y)=>{
    x=x-x%1;
    y=y-y%1;
    arr = new Array(w*2+1);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(h*2+1);
        arr[i].fill(0);
    }
    arr = chosenext(arr,x*2+1,y*2+1);
    return arr;
};