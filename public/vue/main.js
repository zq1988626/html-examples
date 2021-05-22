window.ZQINIT = (function(){
    var requirejsPath = "https://cdn.bootcss.com/require.js/2.3.6/require.min.js";
    var requireConfig = {
        paths:{
            /* 加载器 */
            text:"https://cdn.bootcss.com/require-text/2.0.12/text.min"
            ,css:"https://cdn.bootcss.com/require-css/0.1.10/css.min"
            ,json :'https://cdn.bootcss.com/requirejs-plugins/1.0.3/json.min'
            ,"jquery":"https://cdn.bootcss.com/jquery/3.4.1/jquery.min"
            ,"cookie":"https://cdn.bootcss.com/js-cookie/latest/js.cookie"
            ,"vue":"https://cdn.bootcss.com/vue/2.6.10/vue"
            ,"router":"https://cdn.bootcss.com/vue-router/3.0.7/vue-router"
            ,"ELEMENT":"https://cdn.bootcss.com/element-ui/2.10.0/index"
            ,"axios":"https://cdn.bootcss.com/axios/0.19.0-beta.1/axios"
            ,"ramda":"https://cdn.bootcss.com/ramda/0.26.1/ramda"
            ,"layer":"https://cdn.bootcss.com/layer/2.3/layer"
            ,"promise":"https://cdn.bootcss.com/es6-promise/4.1.1/es6-promise.min"
            ,"bootstrap":"https://cdn.bootcss.com/twitter-bootstrap/3.4.1/js/bootstrap.min"
            ,"template":"https://cdn.bootcss.com/template_js/0.7.1-1/template.min"
            ,"blogcss":"https://blog-static.cnblogs.com/files/ZQ01/index"
        },
        shim:{
            "ELEMENT":{exports:"window.ELEMENT",deps:[
                "css!https://cdn.bootcss.com/element-ui/2.10.0/theme-chalk/index.css"
            ]},
            "bootstrap":{deps:[
                "css!https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css"
            ]},
            "layer":{deps:[
                "jquery",
                "css!https://cdn.bootcss.com/layer/2.3/skin/layer.css"
            ]},
            "blogcss":{deps:["bootstrap"]}
        }
    };

    var initRequire = function(callback){
        var require_ok =false;
        var promise_ok =false;
        if(!window.Promise){
            $.getScript(requireConfig.paths.promise,function(){
                require_ok&&callback();
            });
        }else{
            promise_ok = true;
        }
        $.getScript(requirejsPath,function(){
            requirejs.config(requireConfig);
            promise_ok&&callback();
        });
    }

    var requirePromise = function(deps){
        return new Promise(function(resolve,reject){
            require(deps,function(){
                resolve([].slice.call(arguments));
            },reject)
        })
    }

    var showLoading = function(){
        if(!$("#zqloading").length){
            $(document.body).append(loadingHTML)
        }
    }
    var hideLoading = function(){
        $("#zqloading").hide();
    }
    var loadingHTML = [
    '<div id="zqloading" class="loader">',
        '<div class="loader-inner">',
            '<div class="loader-line-wrap"><div class="loader-line"></div></div>',
            '<div class="loader-line-wrap"><div class="loader-line"></div></div>',
            '<div class="loader-line-wrap"><div class="loader-line"></div></div>',
            '<div class="loader-line-wrap"><div class="loader-line"></div></div>',
            '<div class="loader-line-wrap"><div class="loader-line"></div></div>',
        '</div>',
    '</div>'].join("");
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
    var rev = {
        queryPars:queryPars,
        showLoading:showLoading,
        hideLoading:hideLoading,
        initRequire:initRequire,
        requirePromise:requirePromise
    }
    return rev;
})();