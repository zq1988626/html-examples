/*
 * layout.js
 * anthor:zhuqiang
 * create date:2018-05-23
 * 
 * 
 * 
 * modify:
 * 
 * examples:
 * 1. F.layout()	执行布局（延时）
 * 2. F.layout(true)	执行布局（立即执行）
 * 3. F.layout(callback,true)	执行布局（立即执行），然后执行回调函数（仅执行一次）
 * 4. F.layout.callback.add(callback[,key])	添加回调函数，如果传入了key，则会覆盖key值相同的回调
 * 5. F.layout.callback.remove(callback|key)	移除回调函数，可出入函数或key
 * 6. F.layout.callback.clear() 清除所有回调函数
 */

(function(factery){
	if ( typeof define === "function" && define.amd ) {
		define(["jquery","jquery.reisze","log"], function($,resize,Log) {
			var mylog = Log.getLog("layout");
			var log = function(msg){
				mylog.info(msg)
			};
			return factery($,resize,log);
		} );
	} else if(jQuery && jQuery.resize){
		jQuery.layout = factery(jQuery,jQuery.resize);
	} else if(jQuery){
		jQuery.fn.resize = function (){}
		console&&(console.warn||console.log)("layout 依赖于 jquery.resize，否则只有在window.resize时才会触发布局.")
		jQuery.layout = factery(jQuery,jQuery.resize);
	} else {
		console&&(console.error||console.log)("layout 依赖于 jquery 和 jquery.resize")
	}
})(function($,resize,log){
	var config = {
		interval : 500
	}

	var debounce = (function(){
		return function (fn,delay) {
	        var timer = null; // 声明计时器
	        var once = [];
	    	var callbackFns = [];
	    	
	        var rev = function (callback,asnc) {
	        	var args = arguments;
	            clearTimeout(timer);
	            var _this = this;
	            typeof callback == "function"&&once.push(callback);
	            if(asnc){
	            	rev.now();
	            }else{
		            timer = setTimeout(function () {
		            	rev.now();
		            }, config.interval);
	            }
	        };
	        
	        rev.now = function(){
	            clearTimeout(timer);
                timer = null;
	        	fn();
                once.forEach(function(item){
                	item();
                });
	        	callback();
                once=[];
	        }
	        
	    	var callback = function(){
	    		for(var i =0 ;i < callbackFns.length;i++){
	    			callbackFns[i].fn&&callbackFns[i].fn(callbackFns[i].context);
	    		}
	    	}
	    	callback.add = function(fn,key,context){
	    		if(key){ this.remove(key); }
	    		callbackFns.push({
	    			fn:fn,
	    			key:key,
	    			context:context
	    		});
	    	}
	    	callback.remove = function(p){
	    		var removes = [];
	    		for(var i=0;i<callbackFns.length;i++){
	    			if(callbackFns[i].fn==p){removes.push(i)}
	    			if(callbackFns[i].key==p){removes.push(i)}
	    		}
	    		removes = removes.reverse();
	    		for(var i=0;i<removes.length;i++){
	    			callbackFns.shift(removes[i]);
	    		}
	    	}
	    	callback.clear = function(){
	    		callbackFns = [];
	    	}
	    	
	        rev.callback = callback
	        
	        return rev;
	    }
	})();
	
	log = log || function(msg){
		console&&console.log("layout "+msg)
	};
	
	if($.layout){log("已加载");return;}
	log("开始加载 layout 插件");
	
	var getSize = function($objs){
		var rev = { height: 0, width: 0, otherHeight: 0, otherWidth: 0, outerHeight: 0, outerWidth: 0, children: [] };
        for (var i = 0; i < $objs.length; i++) {
            var o = $($objs[i]);
            var h = o.height(), w = o.width(), oh = o.outerHeight(), ow = o.outerWidth();
            var c = { height: h, width: w, otherHeight: oh - h, otherWidth: ow - w, outerHeight: oh, outerWidth: ow, ele: o }
            rev.height += c.height;
            rev.width += c.width;
            rev.otherHeight += c.otherHeight;
            rev.otherWidth += c.otherWidth;
            rev.outerHeight += c.outerHeight;
            rev.outerWidth += c.outerWidth;
            rev.children.push(c);
        }
        return rev;
	}
	
	var getCV = function (ele, cn) {
        var s = 0;
        if (typeof cn == "string") cn = [cn];
        $(cn).each(function (i, o) {
            s += (parseInt(ele.css(o))||0)
        });
        return s;
    }
	
	//将jquery元素的size撑满父元素
	var fullNode = function(objs){
		objs = $(objs);
		objs.each(function(i,obj){
			var height = 0;
			var width = 0;
			var obj = $(obj);
			if(obj[0].tagName=="BODY"||obj[0].parentElement.tagName=="BODY"){
				height = $(window).height();
				width = $(window).width();
				//obj.css("margin","0");
			}else{
				var p = getSize(obj.parent());
				height = p.height;
				width = p.width;
			}
			var objsize = getSize(obj);
			var boxsizing = obj.css("box-sizing")
			if(boxsizing=="border-box"){
				obj.css({
					height:height,
					width:width
				});
			}else{
				obj.css({
					height:height-getCV(obj,["border-top-width","border-bottom-width","padding-top","padding-bottom","margin-top","margin-bottom"]),
					width:width-getCV(obj,["border-left-width","border-right-width","padding-left","padding-right","margin-left","margin-right"])
				});
			}
		});
	}
	
	//按层级排序
	var sortByTagLevel = function(eles){
		return eles.toArray().sort(function(a,b){
			return $(a).parents().length - $(b).parents().length>0?1:-1;
		});
	}
	
	var callbacks = function(){
		
	}
	
	var beforeCallBack = function(){
		
	}
	
	var setHeight = function(ele,height){
		var $t = $(ele);
		if($t.css("box-sizing")!="border-box"){
			height-=getSize($t).otherHeight
		}
		$t.css("height",height);
	}
	
	$(".layout-full").addClass("layout-c").removeClass("layout-full");
	
	var layout = function(){
		var fullbox = sortByTagLevel($(".layout-full:visible"))
		fullNode(fullbox);
		
		//按层级排序，从顶层开始渲染
		
		var autosize = function(item){
			var parent = $(item).parent();//获取父容器;
			var panels = parent.children(".layout-v:visible,.layout-h:visible,.layout-c:visible");
			var center = panels.filter(".layout-c:visible");
			var cIdx = panels.index(center);
			var befores = panels.filter(":lt("+cIdx+")");
			var afters = panels.filter(":gt("+cIdx+")");
			var beforeV = befores.filter(".layout-v:visible");
			var beforeH = befores.filter(".layout-h:visible");
			var afterV = afters.filter(".layout-v:visible");
			var afterH = afters.filter(".layout-h:visible");
			parent.children(".layout-v").removeClass("layout-v-after")
			afterV.addClass("layout-v-after")
			if(parent[0].tagName=="BODY"){fullNode(parent);}
			
			if(!parent[0].style.overflow){
				parent.css("overflow","hidden")
			}
			
			beforeV.css("float","left");
			afterV.css("position","absolute");
			
			if("relative|absolute|fixed".indexOf(parent.css("position"))==-1){
				parent.css("position","relative");
			}
			
			/**************** 处理所有的margin-top 和 margin-bottom **********************/
			var beforeMarginH = 0;
			var afterMarginH = 0;
			var beforeMarginW = 0;
			var afterMarginW = 0;
			beforeH.each(function(i,item){
				beforeMarginH+=getCV($(item),["margin-top","margin-bottom"]);
			})
			afterH.each(function(i,item){
				afterMarginH+=getCV($(item),["margin-top","margin-bottom"]);
			})
			beforeV.each(function(i,item){
				beforeMarginW+=getCV($(item),["margin-left","margin-right"]);
			})
			afterV.each(function(i,item){
				afterMarginW+=getCV($(item),["margin-left","margin-right"]);
			})
			/************************************************************************/
			
			var parentSize = getSize(parent);
			var beforeHHeight=  getSize(beforeH).outerHeight+beforeMarginH;
			var afterHHeight=  getSize(afterH).outerHeight+afterMarginH;
			var height = parentSize.height - beforeHHeight -afterHHeight;
			var beforeVWidth = getSize(beforeV).outerWidth+beforeMarginW;
			var afterVWidth = getSize(afterV).outerWidth+afterMarginW;
			var centerSize = getSize(center);
			
			//左侧
			beforeV.each(function(c){
				//var otherTop = getCV($t,["border-width-top","padding-top"]);
				setHeight(this,height-getCV($(this),["margin-top","margin-bottom"]));
			})
			
			//右侧
			var right = 0;
			$(afterV.toArray().reverse()).each(function(i,item){
				var $t = $(this);
				var $tSize = getSize($t);
				right += getCV($t,["margin-right"]);
				$t.css({
					top:beforeHHeight+getCV(parent,["padding-top"]),
					right:right+getCV(parent,["padding-right"]),
					//,height:height-$tSize.otherHeight
				});;
				right += $tSize.outerWidth;
				right += getCV($t,["margin-left"]);
				setHeight(this,height-getCV($t,["margin-top","margin-bottom"]));
			})
			
			center.css({
				"margin-right":afterVWidth,
				"margin-left":beforeVWidth
			});
			
			setHeight(center,height-getCV(center,["margin-top","margin-bottom"]));
			
			panels.each(function(){
				$t = $(this);
				if($t.data("data-resize")){
					return ;
				};
				$t.on("resize",function(){
					runLayout();
				})
				$t.data("data-resize",true);
			});
		}
		//遍历执行自适应操作
		$(sortByTagLevel($(".layout-c:visible"))).each(function(){
			autosize(this);
		});
		fullNode(fullbox);
	}
	
	
	/****************** 绑定回调  开始*********************/
	var callbackFns = [];
	var callback = function(){
		for(var i =0 ;i < callbackFns.length;i++){
			callbackFns[i].fn&&callbackFns[i].fn(callbackFns[i].context);
		}
	}
	callback.add = function(fn,key,context){
		if(key){ this.remove(key); }
		callbackFns.push({
			fn:fn,
			key:key,
			context:context
		});
	}
	
	callback.remove = function(p){
		var removes = [];
		for(var i=0;i<callbackFns.length;i++){
			if(callbackFns[i].fn==p){removes.push(i)}
			if(callbackFns[i].key==p){removes.push(i)}
		}
		removes = removes.reverse();
		for(var i=0;i<removes.length;i++){
			callbackFns.shift(removes[i]);
		}
	}
	callback.clear = function(){
		callbackFns = [];
	}
	layout.callback = callback;
	/****************** 绑定回调  结束*********************/
	
	var runLayout = debounce(layout,config.interval);
	runLayout();
	
	$(window).resize(function(){
		$.layout();
	});
	
	$.layout = runLayout;
	//$.layout.callback = callback;
	$.layout.config = config;
	log("加载完毕", true);
	return $.layout;
});