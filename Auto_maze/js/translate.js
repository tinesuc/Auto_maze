

function translate(ell, file){
    var all = ell.querySelectorAll(".trs");
    for(var i=0;i<all.length;i++){
        var txt = all[i].innerText;
        var ind = txt.indexOf("$");
        if(ind>=0){
            var sInd = txt.indexOf(" ", ind);
            var adr="";
            if(sInd>=0){
                adr=txt.substring(ind+1,sInd);
            }else{
                adr=txt.substring(ind+1);
            }
            if(adr!==""){
                
            }
            console.log(adr);
            console.log(ind);
            console.log(txt);
        }
       
        /*
        var jsonData = JSON.parse(file);
        for (var i = 0; i < jsonData.counters.length; i++) {
            var counter = jsonData.counters[i];
            console.log(counter.counter_name);
        }*/
    }
    
}
/*
const box = document.getElementById('box');
const text = document.createTextNode(' tutorial');
box.appendChild(text);

box.insertAdjacentText('beforeend', ' new text');
beforebegin - before the element itself.
afterbegin - just inside the element, before its first child.
beforeend - just inside the element, after its last child.
afterend - after the element itself.


*/
