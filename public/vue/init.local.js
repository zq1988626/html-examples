
(function(){
    var queryPars = function(){
        if(!window.location.search){return null;}
        var rev = {};
        var kvs = window.location.search.slice(1).split("&");
        for(var i=0;i<kvs.length;i++){
            var arr = kvs[i].split("=");
            rev[arr[0]]=arr.length>1?arr[1]:null;
        }
        return rev;
    }
    var rev = queryPars();
    //$.ajaxSetup({cache:true});
    if(rev && rev.app){
        $.getScript("main.js",function(){
            ZQINIT.showLoading();
            window.ZQINIT.initRequire(function(){
                window.ZQINIT.requirePromise([""+rev.app+".js"])
                .then(function(){
                    ZQINIT.hideLoading();
                })
            })
        })
    }else if(rev && rev.debug){
        
    }else{
        $.getScript("theme1.js")
    }
})()