(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== undefined) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        global.zUtil = factory(global, factory);
    }
})(this, function () {
    var _config = {
        path:{
            "requirejs":"lib/requirejs/require.min"
        }
    }

	var importScript = function (src,attrs) {
		var script = document.createElement("script");
        script.src=src;
        for(var a in attrs){
            script.setAttribute(a,attrs[a]);
        }
		document.head.append(script);
		return new Promise(function(resolve,reject){
			script.addEventListener("load",resolve)
		})
    }

    var importRequire = function (){
        return importScript(_config.path.requirejs+".js")
    }

    var init = function(){
        
    }
    var config = function(){

    }

	return {
        config:config,
        importScript: importScript,
        importRequire
	}
});