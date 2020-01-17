define(["jquery","require","vue","useiview"],function($,require,Vue,iView){
	var componentsPath = "./components/";
	var viewsPath = "./views/";
	
	var loader = {
		loadComponent:function(names,isGlob){
			isGlob = isGlob!== false;
			return new Promise(function(resolve, reject){
				require(names.map(function(name){
					return componentsPath+name
				}),function(){
					var rev={};
					[].forEach.call(arguments,function(item){
						isGlob&&Vue.component(item.name,item);
						rev[item.name] = item;
					})
					resolve(rev);
				});
			});
		},

		loadView:function($container,name,opt){
			return new Promise(function(resolve, reject){
				require([viewsPath+name],function(view){
					if(typeof view == "function"){
						opt = view(opt);
					}else{
						opt = $.extend({},view,opt);
					}
					opt.el = "#"+$($container).attr("id");
					resolve(new Vue(opt));
				});
			});
		}
	}
	
	$.fn.loadView= function(name,opt){
		return Promise.all($(this).map(function(i,item){
			return loader.loadView($(this),name,opt);
		}).toArray()).then(function(vues){
			return vues?vues[0]:null;
		});
	};
	
	return loader;
});
