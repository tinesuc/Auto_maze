function translate(ell, file, atr=null){
    if(ell.classList!=undefined&&ell.classList.contains("trs")){
        var all = [ell];
    }else{
        var all = ell.querySelectorAll(".trs");
    }
    var atrnl = atr==null;
    for(var i=0;i<all.length;i++){
        var txt = all[i].getAttribute("trtxt");
        var acl="";
        var trl="";
        var val="";
        for(var j=0;j<txt.length;j++){
            var chr = txt.charAt(j);
            if(chr=='$'||trl!=""){
                if(trl==""){
                    trl="$";
                    continue;
                }else if(chr=="$"){
                    if(trl.length>1){
                        acl+=file[trl.substring(1)];
                    }
                    trl="";
                    continue;
                }else{
                    trl+=chr;
                }
            }else if((chr=='%'||val!="")){
                if(atrnl){
                    var trval = all[i].getAttribute("trval");
                    if(trval!=null){
                        if(trval.indexOf(",")>=0){
                            var trvals = trval.split(",");
                        }else{
                            var trvals = [trval];
                        }
                        var atr = [];
                        for(var k=0;k<trvals.length;k++){
                            var spl= trvals[k].split(":");
                            if(spl[1].charAt(0)=="$"){//todo: improve
                                spl[1]=file[spl[1].substring(1,spl[1].length-1)];
                            }
                            atr[spl[0]]=spl[1];
                        }
                        if(val==""){
                            val="%";
                            continue;
                        }else if(chr=="%"){
                            if(val.length>1){
                                acl+=atr[val.substring(1)];
                            }
                            val="";
                            continue;
                        }else{
                            val+=chr;
                        }
                    }
                }
                if(!atrnl){
                    if(val==""){
                        val="%";
                        continue;
                    }else if(chr=="%"){
                        if(val.length>1){
                            acl+=atr[val.substring(1)];
                        }
                        val="";
                        continue;
                    }else{
                        val+=chr;
                    }
                }
            }else{
                acl+=chr;
            }
        }
        all[i].innerHTML=acl;
    }
}