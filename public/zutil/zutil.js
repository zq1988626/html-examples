(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== undefined) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        global.zUtil = factory(global, factory);
    }
})(this, function () {
    var _gts= function(s){
        var t = Object.prototype.toString.call(s);
        return t.substring(8,t.length-1)
    }

    //类型判断
    var isString = function(s){return _gts(s)=="String"}
    var isNumber = function(s){return _gts(s)=="Number"}
    var isArray = function(s){return _gts(s)=="Array"}
    var isFunction = function(s){return _gts(s)=="Function"}
    var isPlainObject = function(s){return _gts(s)=="Object"}
    var isEmpty = function(s){return ["Undefined","Null"].indexOf(_gts(s))>-1||s===""}

    //向页面加入Script
	var importScript = function (src,cb,attrs) {
		var script = document.createElement("script");
        script.src=src;
        for(var a in attrs){
            script.setAttribute(a,attrs[a]);
        }
        document.head.append(script);
        cb&&script.addEventListener("load",cb);
        return script;
    }

    //ajax 请求js
    var loadScript = function(url,callback){
        ajax(url,{type:"GET",success:function(jscode){
            eval(jscode);
            callback();
        }})
    }

    //请求
	var ajax = function(url,option){
        option = option || {};
	    var xhr=window.XMLHttpRequest?new XMLHttpRequest():ActiveXObject('Microsoft.XMLHTTP');
	    xhr.onreadystatechange=function(){
            if(xhr.readyState!=4){return;}
            option.success&&option.success((xhr.status>=200&&xhr.status<300)?xhr.responseText:window.currentVersion)
	    }
        xhr.open(option.type||'POST',url,true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type",option.contentType || "application/x-www-form-urlencoded");
        xhr.send(option.data||"");
    }

    var getDomainTop=function(){
        var cwin = window;
        while(cwin != cwin.parent){
            try{
                var href = window.parent.location.href;
                cwin=cwin.parent;
            }catch(ex){
                break;
            }
        }
        return cwin;
    }

    var getDomainParent = function(){
        var cwin
        try{
            var href = window.parent.location.href;
            cwin = window.parent;
        }catch(ex){
            cwin = window;
        }
        return cwin;
    }

    var resetTopAndParent = function(){
        window.top = getDomainTop();
        window.parent = getDomainParent();
    }
	return {
        importScript: importScript,
        ajax:ajax,
        loadScript:loadScript,
        isString:isString,
        isNumber:isNumber,
        isFunction:isFunction,
        isPlainObject:isPlainObject,
        isEmpty:isEmpty,
        isArray:isArray,
        resetTopAndParent:resetTopAndParent
	}
});