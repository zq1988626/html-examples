/* 首页tabs组件 */
define(["jquery","vue","lodash","./kj-layout","css!./kj-tabs-topmenu"],function($,Vue,_){
	var template = [
		'<kj-layout class="kj-tabs-topmenu">',
		    '<kj-layout-t slot="kj-layout-t" v-on:mousewheel="onScroll" :class="{hasscroll:hasScroll}">',
				'<div ref="leftbtn" :class="{disabled:disabledLeft}" @click="scrollLeftClick" v-if="hasScroll" class="scrollbtn">',
					'<span class="glyphicon glyphicon-chevron-left"></span>',
				'</div>',
				'<div class="kjtabs-header-wrap" ref="listwrap">',
					'<transition-group name="list-complete" tag="ul" class="kjtabs nav nav-tabs" style="display:inline-block">',
						'<li v-for="item in items" ',
							'class="list-complete-item"  ',
							':class="{active:item.active}"',
							':key="item.id"',
							'v-on:click="selectTab(item)"',
						'>',
							'<a href="javascript:void(0);">{{item.title}}</a>',
							'<span v-if="!item.noclose"  @click.stop="deleteTab(item.id)" class="menutitle badge">×</span>',
						'</li>',
					'</transition-group>',
				'</div>',
				'<div ref="rightbtn" :class="{disabled:disabledRight}" @click="scrollRightClick" v-if="hasScroll" class="scrollbtn">',
					'<span class="glyphicon glyphicon-chevron-right"></span>',
				'</div>',
		    '</kj-layout-t>',
		    
		    '<kj-layout-t slot="kj-layout-t" style="height:8px;">',
		    '</kj-layout-t>',
		    
		    '<kj-layout-c slot="kj-layout-c">',
				'<transition-group name="list-complete-y" tag="div" style="width:100%;height:100%;position: relative;">',
					'<iframe v-if="item.rendered" ',
						'v-show="item.active" ',
						'style="width:100%;height:100%" ',
						'v-for="item in items" ',
						'class="list-complete-y-item" ',
						':src="item.url"  ',
						':key="item.id">',
					'</iframe>',
				'</transition-group>',
		    '</kj-layout-c>',
		'</kj-layout>'
	].join("\n");
	
	Vue.component('kj-tabs-topmenu', {
		props:['items',"idfield"],
		data: function () {
		  return {
			  boxWidth:0,
			  innerWidth:0,
			  scrollLeft:0,
			  currentTab:null,
			  selectModule:null
		  }
		},
		created:function(){
			var _this = this;
			
			this.items.forEach(function(item){
				item = $.extend({
					id:null,
					title:"页签",
					url:null,
					active:false,
					rendered:false,
					noClose:false,
					module:null
				},item)
			});
			
			var actives = this.items.filter(function(item){
				return item.active === true;
			});
			
			if(actives.length>0){
				actives.forEach(function(item){
					item.active = false;
				});
				actives[0].active=true;
				actives[0].rendered = true;
				this.current = actives[0];
			}
			$.layout.callback.add(function(){
				_this.updateScroll();
			})
		},
		mounted:function(){
			var _this = this;
			this.updateScroll();
		},
		
		computed:{
			disabledLeft:function(){
				return this.scrollLeft == 0;
			},
			disabledRight:function(){
				return this.innerWidth - this.scrollLeft - this.boxWidth <=0;
			},
			hasScroll:function(){
				return this.boxWidth-this.innerWidth<0
			},
			step:function(){
				return this.boxWidth*0.8 || 100;
			}
		},
		watch: {
			selectModule: function (val) {
				this.$emit("select-menu",val);
		    }
		},
		methods:{
			showTab:function(){
				this.$nextTick(function(){
					var activeEl = $("li.active",this.$refs["listwrap"]);
					var l = activeEl.position().left;
					if(l-20<0){
						this.scrollTo(l-20);
					}
					var w = activeEl.width();
					if(l>this.boxWidth-w){
						this.scrollTo(l-this.boxWidth+w-20);
					}
				});
				this.selectModule = this.current.module||"";
			},
			updateScroll:function(){
				this.$nextTick(function(){
					var wraper = $(this.$refs["listwrap"]);
					var box = wraper.children().eq(0);
					this.boxWidth=wraper.width();
					this.innerWidth=box.width();
					this.scrollLeft = wraper.scrollLeft();
				});
			},
			getTabById:function(id){
				return this.items.filter(function(item){return item.id == id})[0];
			},
			selectTab:function(item){
				if(this.current){
					this.current.active = false
				};
				this.current = this.getTabById(item.id);
				this.current.active = true;
				this.current.rendered = true;
				this.updateScroll();
				this.showTab();
			},
			selectLast:function(){
				this.items.length&&(this.items[this.items.length-1].active = true);
			},
			getNextTab:function(id){
				//如果非最后一个，则取后一个，否则取前一个，若只有一个则直接返回空
				
				var rev = null;
				for(var i = 0;i<this.items.length;i++){
					if(this.items[i].id != id) {continue;}
					if(i<this.items.length-1){
						rev = this.items[i+1];
						break;
					}
					if(i==this.items.length-1&&i>0){
						rev = this.items[i-1];
						break;
					}
					return null;
				}
				return rev;
			},
			deleteTab:function(id){
				//找到下一个页签
				var nextTab = this.getNextTab(id);
				
				if(nextTab && this.current && this.current.id == id){
	    			this.selectTab(nextTab);
				}
				var index = -1;
				for(var i =0;i<this.items.length;i++){
					if(this.items[i].id==id){
						index = i;
						break;
					}
				}
				this.$delete(this.items,index);
				this.updateScroll();
				this.showTab();
			},
			addTab:function(name,url,selected,data,hasClase){
				var id = data[this.idfield];
				var is = this.getTabById(id);
				if(is){
					this.selectTab(is);
					this.updateScroll();
					this.showTab();
					return;
				}
				if(url){
					url+=url.indexOf("?")==-1?"?":"&";
					url+="_m="+id;
				}
				var item = $.extend(true,{
					active:false,
					rendered:false
				},{
					id:id,
					title:name,
					url:url,
					noClose:hasClase===false,
					module:data.module&&data.module[this.idfield]||data[this.idfield]
				});
				
				this.items.push(item);
				this.selectTab(item);
				this.updateScroll();
				this.showTab();
			},
			scrollTo:function(v,useanimate){
				var _this = this;
				useanimate = useanimate!==false;
				var el = $(this.$refs["listwrap"]);
				if(useanimate){
					el.animate({
						scrollLeft: this.scrollLeft + v
					},300,function(){
						_this.updateScroll();
					});
				}else{
					el.scrollLeft(this.scrollLeft + v);
					this.updateScroll();
				}
			},
			
			onScroll:function(e){
				this.scrollTo(e.deltaY,false);
			},
			scrollLeftClick:function(){
				this.scrollTo(this.step*-1);
			},
			scrollRightClick:function(){
				this.scrollTo(this.step);
			}
		},
		template:template
	})
	
	
	return null;
})