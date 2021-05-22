/*!
  * protoExt. v0.0.1 (https://prototype-extend.github.io/)
  * Copyright 2020-2020 The prototypeExtend Authors (https://github.com/kykjsoft/protoext/graphs/contributors)
  * Licensed under MIT (https://github.com/kykjsoft/protoext/master/LICENSE)
  */
(function (root, factory) {
	factory.bind&&factory.bind(root);
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.protoExt = factory();
    }
}(this, function () {
	if(Object.__extend){return Object.__extend;}

	//get constructor list
	var getConstructors = function(obj){
		var proto = obj.__proto__;
		var names = [];
		while(proto){
			names.push(proto.constructor)
			proto = proto.__proto__;
		}
		return names;
	}

	//extend
	var extend = function(base,sub,prototypes){
		var classbprotos = [prototypes||{},sub.prototype];
		var __ = function(){this.constructor = sub;}
		sub.prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new __());
		for(var i=0;i<classbprotos.length;i++){
			for(var a in classbprotos[i]){
				if(!sub.hasOwnProperty(a) && classbprotos[i].hasOwnProperty(a)){
					sub.prototype[a]=classbprotos[i][a];
				}
			}
		}
		return sub;
	}

	return {
		extend:extend,
		getConstructors:getConstructors,

		//bind to Object
		appendGCToObject:function(name){
			Object.prototype[name||"__proto__path__"]=function(){
				return getConstructors(this)
			}
		},

		//bind to Function
		appendEXToFunction:function(name){
			Function.prototype[name||"__extend"] = function(sub,prototypes){
				return extend.apply(this,[this].concat([].splice.call(arguments,0)))
			}
		}
	};
}));