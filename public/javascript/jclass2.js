(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.jClass2 = factory(root.jQuery);
    }
}(this, function ($) {
    var PT = "prototype";
		
	//拷贝静态方法
	var copyStaticFunction = function(target,source){
		for(var n in source){
			target[n] = source[n]
		}
	}

	var sameNameFunction = function(target,extend){
		var _p = target["prototype"];
		if(!target){return;}

		// 同名函数处理
		for (var n in extend) {
			if (!extend.hasOwnProperty(n)) {continue;}
			var	_c = extend[n];
			
			// 同名函数
			if ($.isFunction(_c) && $.isFunction(_p[n]) ) {
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

			// 同名对象
			} else if($.isPlainObject(_c) && $.isPlainObject(_p[n])) {
				_p[n] = $.extend(true,{},_p[n],_c);

			// 同名属性
			} else {
				_p[n] = _c;
			}
		}
	}

	return function(pisBindContext,pbase){
		var isBindContext = pisBindContext;
		var base = pbase;
		var extend,isF,mixins = [],args = arguments;
		
		//初始化参数
		var extIndex = 0;
		if($.type(isBindContext) === "boolean"){
			extIndex++;
			if($.isFunction(base)){
				extIndex++;
			} else {
				base = null;
			}
		} else if ($.isFunction(isBindContext)) {
			base = isBindContext;
			isBindContext = false;
			extIndex++;
		} else if ($.isPlainObject(isBindContext)) {
			base = null;
			isBindContext = false;
			extIndex++;
		}
		mixins = [].slice.call(args,extIndex);
		extend = mixins.shift()||null;
		
		var F = function(){
			if (isF) {return;}
			var _p = F[PT],_ = this;

			//没有使用new方法，直接调用
			if(!(this instanceof F)){
				throw "请使用New关键字"
			}

			if (base) {
				//执行基类构造函数
				base.apply(this,arguments);
				//指定base类
				_.baseprototype = base[PT];
			}

			// 将全部方法this指向当前对象
			if(isBindContext){
				for(var n in _p){
					if(!$.isFunction(_p[n]) ) continue;
					_p[n] = _p[n].bind(_);
				}
			}

			for(var n in _p){
				if( $.isPlainObject(_p[n]) ){
					this[n] = $.extend(true,{},_p[n])
				}
			}
		}
		
		// 如果此类需要从其它类扩展
		if (base) {
			var ___ = function(){this.constructor=base;}
			___[PT] = base[PT];
			F[PT] = new ___();
			sameNameFunction(base,extend);
			copyStaticFunction(F,base);
		}

		if(mixins.length>0){
			return arguments.callee.apply(this,[isBindContext,F].concat(mixins));
		}
		
		return F;
	}
}));