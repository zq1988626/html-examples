define(["jquery","vue"],function($,Vue){
	Vue.component('kj-layout',{
		
		mounted:function(){
			this.layout();
		},
		
		created:function(){
			var _this = this;
			$.layout.callback.add(function(){
				_this.layout();
			})
		},

		methods:{
			layout:function(){
				var h = _.sum(this.getChildren(["kj-layout-t","kj-layout-b"])
					.map(function(item){
						return $(item.$el).outerHeight()
					})
				);
				var zh = $(this.$el).height();
				this.getChildren(["kj-layout-c","kj-layout-l","kj-layout-r"])
				.forEach(function(c){
					$(c.$el).height(zh-h)
				})
			},
			getChildren:function(name){
				var name = typeof name == "string"?[name]:name;
				return this.$children.filter(function(item){
					return name.indexOf(item.$options.name)>-1;
				})
			}
		},
		
		template:[
			'<div style="height:100%;width:100%;">',
			    '<slot name="kj-layout-t"></slot>',
			    '<slot name="kj-layout-l"></slot>',
			    '<slot name="kj-layout-r"></slot>',
			    '<slot name="kj-layout-c"></slot>',
			    '<slot name="kj-layout-b"></slot>',
			'</div>'
		].join("\n")
	});
	
	Vue.component('kj-layout-t',{
	  computed: {
		  inputListeners: function () {
		      var vm = this
		      // `Object.assign` 将所有的对象合并为一个新对象
		      return Object.assign({},
		        // 我们从父级添加所有的监听器
		        this.$listeners,
		        // 然后我们添加自定义监听器，
		        // 或覆写一些监听器的行为
		        {
		          // 这里确保组件配合 `v-model` 的工作
		          div: function (event) {
		            vm.$emit('div', event.target.value)
		          }
		        }
		      )
		    }
		},
		
		template:[
			'<div class="kj-layout-t" v-on="inputListeners">',
			    '<slot></slot>',
			'</div>'
		].join("\n")
	});
	Vue.component('kj-layout-l',{
		template:[
			'<div class="kj-layout-l" style="float:left;">',
			    '<slot></slot>',
			'</div>'
		].join("\n")
	});
	
	Vue.component('kj-layout-r',{
		template:[
			'<div class="kj-layout-r" style="float:right;">',
			   '<slot></slot>',
			'</div>'
		].join("\n")
	});
	
	Vue.component('kj-layout-b',{
		template:[
			'<div class="kj-layout-b">',
			    '<slot></slot>',
			'</div>'
		].join("\n")
	});
	
	Vue.component('kj-layout-c',{
		template:[
			'<div class="kj-layout-c" style="margin:auto;overflow: hidden;">',
			    '<slot></slot>',
			'</div>'
		].join("\n")
	});
	
	
	return function(option){
		return getOption(option);
	};
})