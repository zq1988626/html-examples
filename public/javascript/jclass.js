(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.jClass = factory(root.jQuery);
    }
}(this, function ($) {
    var PT = "prototype";
	return function(pIsBindContext,pBase,pExtend){
		var isBindContext=false
			,base=null
			,extend
			,idF
			,mixins = []
			,args = arguments;
		
		//初始化参数
		if($.type(args[0]) === "boolean"){
			isBindContext = args[0];
			if($.isFunction(args[1])){
				base = args[1];
				mixins = [].slice.call(args,2);
			} else if ($.isPlainObject(args[1])){
				mixins = [].slice.call(args,1);
			}
		} else if ($.isFunction(args[0])) {
			base = args[0];
			mixins = [].slice.call(args,1);
		} else if ($.isPlainObject(args[0])) {
			base = null;
			mixins = [].slice.call(args,0);
		}
		extend = mixins.shift() || null;
		
		
		var F = function(){
			if (isF) {return;}
			var _p = F[PT],_ = this;
			
			if (base) {
				_.baseprototype = base["prototype"];
			}
			// 将全部方法this指向当前对象
			if(isBindContext){
				for(var n in _p){
					if( $.isFunction(_p[n]) ){
						_p[n] = _p[n].bind(_);
					}
				}
			}
			for(var n in _p){
				if( $.isPlainObject(_p[n]) ){
					this[n] = $.extend(true,{},_p[n])
				}
			}
			try{
				this._INITRETRUN = Promise.resolve(_.init && _.init.apply(_, arguments));
			}catch(ex){
				this._INITRETRUN = Promise.reject(ex);
			}
		}
		
		// 如果此类需要从其它类扩展
		if (base) {
			isF = true;
			F["prototype"] = new base();
			F["prototype"].constructor = F;
			isF = false;
		}
		
		// 同名函数处理
		for (var n in extend) {
			if (extend.hasOwnProperty(n)) {
				var	_c = extend[n];
				var _p = F["prototype"];
				
				// 存在同名函数
				if ( base && $.isFunction(_c) && $.isFunction(_p[n]) ) {
					_p[n] = (function(_n, fn) {
						var m = function() {
							var me = this,
								_b = me.base,
								r;  
							me.base = base["prototype"][_n];
							r = fn.apply(me, arguments);
							me.base = _b;  
							return r;
						};
						m.callFn = fn;
						return m;
					})(n, _c);
					
				} else if(base && $.isPlainObject(_c) && $.isPlainObject(_p[n])) {
					_p[n] = $.extend(true,{},_p[n],_c);
				} else {
					_p[n] = _c;
				}
			}
		}
		
		//静态方法
		var f;
		for(var n in base){
			f = extend[n];
			if( $.isFunction(f) ){
				F[n] = f
			}
		}
		if(mixins.length>0){
			return arguments.callee.apply(this,[isBindContext,F].concat(mixins));
		}
		return F;
	}
}));