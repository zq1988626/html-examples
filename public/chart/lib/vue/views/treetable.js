define(["jquery","vue","iview"],function($,Vue,iView){

	var demodata = [
        {id:"mz",pid:null,open:1,name: '煤种1',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001",pid:"mz",name: '煤种1',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001001",pid:"001",name: '煤种11',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001001001",pid:"001001",name: '煤种111',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001001002",pid:"001001",name: '煤种112',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001002",pid:"001",name: '煤种12',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001002001",pid:"001002",name: '煤种121',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001002002",pid:"001002",name: '煤种122',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001002003",pid:"001002",name: '煤种123',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"001002004",pid:"001002",name: '煤种124',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"002",pid:"mz",name: '煤种2',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"002001",pid:"002",name: '煤种21',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"002002",pid:"002",name: '煤种22',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"003",pid:"mz",name: '煤种3',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"004",pid:"mz",name: '煤种4',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
        {id:"004001",pid:"004",name: '煤种41',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100}
	]
	
	var democolumns = [
        {type: 'index',title: '序号',width: 60,align: 'center',"fixed": "left"},
        //{type: 'selection',width: 60,align: 'center',"fixed": "left"},
        {width: 200,key:"name",title: '名称'},
        {title: '煤量',"width": 150,key: 'ml',isinput:true,hjtype:"sum",decimalDigits:3},
        {title: '热值',"width": 150,key: 'rz',isinput:true,hjtype:"jqpj",hjkey:"ml",decimalDigits:2},
        {title: '硫分',"width": 150,key: 'lf',isinput:true,hjtype:"jqpj",hjkey:"ml",decimalDigits:1},
        {title: '全水',key: 'hff',isinput:true,hjtype:"jqpj",hjkey:"ml"}
    ];
	
	var INPUTERS = {
		"text":"Input",
		"date":"DatePicker",
		"number":"InputNumber"
	}
	
	var template = `
		<Table size="small" border highlight-row :height="height" ref="selection" stripe :columns="showColumns" :data="showdata">

		</Table>
		<Table size="small" :show-header="false" border :columns="hjcolumns" :data="hjdata"></Table>
	`;
	
	var template2 = `
		<div>
			<Table size="small" border highlight-row ref="selection" height="400" stripe :columns="columns" :data="showdata"></Table>
			<Table size="small" :show-header="false" border :columns="hjcolumns" :data="hjdata"></Table>
		</div>
	`;
	
	//生成渲染器
	var rendExendColumn = function(vueobj){
		return function(h, params){
			var rowdata = params.row;
			if(rowdata.type=="hj"){
				return h('div',{
					style:"font-weight: bold;"
				},"合计")
			}
            const open = rowdata.open;
	        var content = [];
	        var levstr = "";
	        for(var i=0;i<rowdata.level;i++){
	        	content.push(h('span',{
	        		class:"treegridnoleft"
	        	}));
	        }
	        if(open<2){
	        	content.push(h('Icon', {
	                style: {cursor: 'pointer'},
	                props: {
	                    type:open==0?"ios-arrow-forward":"ios-arrow-down"
	                },
	                nativeOn: {
	                    click: () => {
	                        vueobj.toggleFav(params);
	                    }
	                }
	            }))
	        }else{
	        	content.push(h("span",{
	        		class:"treegridsplit"
	        	}))
	        }
	        var str = params.row.data[vueobj.namefield];
	        if(params.column.ywlx){
	        	str = F["enum"].getValue(params.column.ywlx,str)
	        }
	        	
	        content.push(h('span', ' ' + str));
	        return h('div',content);
		}
	}
	
	
	//生成渲染器
	var focusid = null; //焦点id
	var rendInputColumn = function(vueobj){
		return function(h, params){
			var rowdata = params.row;
			var column = params.column;
			
			var onchange = function(){
				vueobj.trigger("cellChange");
			}
			
			if(rowdata.type=="hj"){
				return h('span',{
					class:"inputcell_readonly",
					style:"font-weight: bold;"
				},params.row[params.column.key]);
			}
			if(vueobj.cellEdit && params.row.children.length==0){
				var type = INPUTERS["number"];
				if(params.column.inputtype&&INPUTERS[params.column.inputtype]){
					type = INPUTERS[params.column.inputtype]||INPUTERS["number"];
				}
				if(params.column.inputtype=="date"){
					return h(type,{
						//ref:"content_"+params.index+"_"+params.column.key,
						props: {
	                      	value: params.row[params.column.key],
	                      	type:"date"
		                },
		               	on:{
		               		"on-change":function(value){
		               			vueobj.updaterowdata(params.row,params.column.key,value);
		               			onchange();
		               		}
		               	}
					});
				} else if(params.column.inputtype=="text"){
					return h(type,{
						//ref:"content_"+params.index+"_"+params.column.key,
						props: {
	                      	value: params.row[params.column.key],
							"element-id":["cell",params.index,params.column._index].join("-"),
                  			activeChange:false,
		                },
		               	on:{
		               		"on-focus":function(value){
		               			focusid = arguments[0].srcElement.id;
		               			value.currentTarget._olddata = value.currentTarget.value;
		               		},
		               		"on-blur":function(value){
		               			if(value.currentTarget.value == value.currentTarget._olddata){
		               				return;
		               			}
		               			vueobj.updaterowdata(params.row,params.column.key,value.currentTarget.value);
		               			onchange();
								vueobj.$nextTick(function() {
									if(focusid){
										$("#"+focusid).focus();
									}
								});
		               		}
		               	}
					});
				} else if((!params.column.inputtype)||params.column.inputtype=="number"){
					return h(type,{
						//ref:"content_"+params.index+"_"+params.column.key,
						props: {
							//autofocus:true,
							"element-id":["cell",params.index,params.column._index].join("-"),
	                      	value: params.row[params.column.key],
	                      	activeChange:false,
	                      	step:params.column.step||1,
	                      	precision:params.column.precision
		                },
		               	on:{
		               		"on-focus":function(){
		               			focusid = arguments[0].srcElement.id;
		               		},
		               		"on-change":function(value){
		               			vueobj.updaterowdata(params.row,params.column.key,value);
		               			onchange();
								vueobj.$nextTick(function() {
									if(focusid){
										$("#"+focusid).focus();
									}
								});
		               		}
		               	}
					});
				}else{
					return h(type,{
						//ref:"content_"+params.index+"_"+params.column.key,
						props: {
	                      	value: params.row[params.column.key]
		                },
		               	on:{
		               		"on-change":function(value){
		               			vueobj.updaterowdata(params.row,params.column.key,value);
		               			onchange();
		               		}
		               	}
					});
				}
			}else{
				

		        var str = params.row[params.column.key];
		        if(params.column.ywlx){
		        	str = F["enum"].getValue(params.column.ywlx,str)
		        }
				
				return h('span',{
					class:"inputcell_readonly"
				},str);
			}
		}
	}
	
	var getGridData = function(data,opt){
		var data = getTreeData(data,opt);
		var list = [];
		var each = function(tree){
			tree.forEach(function(item){
				list.push(item);
				each(item.children);
			});
		}
		each(data);
		return list;
	};
	
	var getTreeData = function(data,opt){
		var idfield = opt.idfield;
		var pidfield = opt.pidfield;
		var fields = opt.columns;
		var getNodes = function(pid,list,level){
			return list.filter(function(item){
				return item[pidfield] == pid;
			}).map(function(item){
				var rev = {
					open:2,
					level:level,
					data:item,
					id:item[idfield],
					pid:item[pidfield],
					parent:pid
				};
				
				rev.children = getNodes(rev.id,list,level+1);
				
				if(rev.children.length){
					rev.open = typeof item.open != "undefined"?item.open:0;
				}
				fields.forEach(function(col){
					if(col.name){
						rev[col.name] = item[col.name]
					}
				});
				return rev;
			});
		}
		return getNodes(null,data,0);
	}
	
	//聚合函数
	var hejitype = {
		sum:function(list,key){
			return F.common.parseFloat(list.map(function(item,i){
				return item[key]||0
			}).join("+"));
		},
		jihe:function(list,key,key2){
			return F.common.parseFloat(list.map(function(item,i){
				return item[key]*item[key2];
			}).join("+"));
		},
		jqpj:function(list,key,key2){
			var sum = this.sum(list,key2);
			if(!sum){return 0}
			return this.jihe(list,key,key2)/sum;
		},
		count:function(list){
			return list.length||0;
		}
	}
	
	var VueEvent = function(context){
		this.events = {};
		this.context = context;
		var _this = this;
		context.bind = function(type,fn,context){
			var events = _this.events;
			events[type] = events[type] || [];
			if(context&&fn.bind){
				fn = fn.bind(context);
				fn.args = [].slice.call(arguments,3);
			}
			events[type].push(fn);
		}
		context.trigger = function(type){
			if(!_this.events[type]){
				return;
			}
			var arg = [].slice.call(arguments,1);
			arg.push(context);
			var events = _this.events[type];
			var rev;
			if(events){
				for(var i =0;i<events.length;i++){
					rev = events[i].apply(context,[type].concat(arg).concat(events[i].args));
				}
			}
			if(rev){
				return rev;
			}
	    }
	}
	VueEvent.create=function(context){
		new VueEvent(context);
		return context;
	};
	
	var getOption = function(option){
		option.data = option.data || [];
		/*
		option = {
			data:demodata,
			columns:democolumns
		}
		*/
		
		option = $.extend({
        	idfield:"id",
        	pidfield:"pid",
        	namefield:"name",
            columns: [],
            datasource:[]
		},option);
		option.datasource = option.data || [];

		return {
			template:template,
	        data:function(){
	        	if(!option.height){
	        		option.height = null;
	        	}
	        	option.columns = option.columns || [];
	        	option.datalist = getGridData(option.datasource,option);
	        	return option;
	        },
		    computed: {
		    	showColumns:function(){
		        	var vueobj = this;
		        	var columns = [];
		        	if(this.rownumbers!==false){
		        		columns.push({
		        			type:'index',
		        			width:60,
		        			align: 'center',
		        			title:"序号"
		        		});
		        	}
		        	columns = columns.concat(JSON.parse(JSON.stringify(this.columns)));
		        	var namecol = columns.filter(function(item){
		        		return item.key == vueobj.namefield
		        	});
		        	for(var i =0;i<columns.length;i++){
		        		if(columns[i].name){
		        			columns[i].key = columns[i].name;
		        		}
		        		if(columns[i].key == vueobj.namefield){
		        			columns[i].render = rendExendColumn(this);
		        		}
		        		if(columns[i].isinput===true){
		        			columns[i].className = "treetable_input"
		        			columns[i].render = rendInputColumn(this);
		        		}
		        	}
		    		return columns.filter(function(item){
		    			return item.hidden !== true;
		    		});
		    	},
		    	hjcolumns:function(){
		    		return option.columns.map(function(item,i){
		    			return {
		    				title: item.title,
		    				width: item.width,
		    				key: item.name||(i==0?"index":null)
		    			}
		    		});
		    	},
		    	hjdata:function(){
		    		var rev = {type:"hj",index:"合计"};
		    		var list = this.datalist.filter(function(item){
		    			return !item.pid
		    		});
		    		var columns = this.columns.filter(function(item){
		    			return item.isinput && (item.inputtype == "number" || !item.inputtype)
		    		}).map(function(c){
		    			rev[c.name] = F.common.parseFloat(list.map(function(d){
		    				return d[c.name]||0
		    			}).join("+"))
		    		});
		    		return [rev]
		    	},
		    	kvdata:function(){
		    		var rev = {};
		    		this.datalist.forEach(function(item){
		    			rev[item.id]=item;
		    		});
		    		return rev;
		    	},
		    	kvcolumn:function(){
		    		var rev = {};
		    		this.columns.forEach(function(item){
		    			if(item.name){
		    				rev[item.name]=item;
		    			}
		    		});
		    		return rev;
		    	},
		    	showdata:function(){
		    		var list = [];
		    		
		    		var add = function(item){
		    			list.push(item)
		    			if(item.children&&item.children.length&&item.open==1){
		    				item.children.sort(function(a,b){
					    			return a.name>b.name?1:-1;
					    	}).forEach(function(citem){
		    					add(citem);
		    				});
		    			}
		    		}
		    		
		    		this.datalist.filter(function(item){
		    			return !item.pid;
		    		}).sort(function(a,b){
		    			return a.name>b.name?1:-1;
		    		}).forEach(function(item){
		    			add(item);
		    		});
		    		
		    		/*
		    		this.datalist.forEach(function(item,i){
		    			item.
		    		});
		    		*/
		    		if(this.showRowTotals){
		    			if(this.showRowTotals == "top"){
		    				list = this.hjdata.concat(list);
		    			}else{
		    				list = list.concat(this.hjdata);
		    			}
		    		}
		    		return list;
		    	}
		    },
		    watch: {
		    	
		    },
	        mounted () {
	        	
	        },
		    methods: VueEvent.create({
		    	updatelist:function(){
		    		this.datalist = getGridData(this.datasource,this);
		    	},
		        toggleFav (params) {
		        	this.updateRefData(params.row.id,function(data){
		        		data.open = data.open===0?1:0;
		        	});
		        },
		        updateRefData:function(id,field,value){
		        	if(this.kvdata[id]){
						if(typeof field == "function"){
							field(this.kvdata[id]);
						}else{
							this.kvdata[id][field] = value;
							this.kvdata[id].data[field] = value;
						}
		        	}
		       },
			    addRowData(){
			    	this.items.push({});
			    },
			    
			    ///更新行数据
			    updaterowdata:function(data,key,value){
			    	var _this = this;
			    	var v = value;
			    	var column = this.kvcolumn[key];
		        	if((!column.inputtype)||column.inputtype=="number"){
				    	var defaultDecimalDigits = 2;
				    	var jd = column.decimalDigits||defaultDecimalDigits;
				    	v = F.common.parseFloat(value,jd);
		        	}
		        	this.updateRefData(data.id,key,v);
			    	if(!column.hjtype){return;}
		        	var updateColumnData = function(data,key){
			        	var column = _this.kvcolumn[key];
			        	if(!column.hjtype){return ;}
			        	var hjfn = hejitype[column.hjtype];
			        	if(!hjfn){return ;}
			        	var hjkey = column.hjkey || null;
			        	var jd = column.decimalDigits||defaultDecimalDigits;
			        	var updateparent = function(parentid){
			        		_this.updateRefData(parentid,function(data2){
			        			var clist = data2.children;
			        			if(data2.children && data2.children.length){
					    			_this.updateRefData(parentid,key,F.common.parseFloat(hjfn.call(hejitype,clist,key,hjkey),jd));
			        			}
			        		});
			        		if(_this.kvdata[parentid].parent){
			        			updateparent(_this.kvdata[parentid].parent);
			        		}
			        	}
				    	if(data.parent){
				    		updateparent(data.parent);
				    	}
		        	}
		        	
		        	updateColumnData(data,key);
		        	this.columns.filter(function(column,i){
		        		return column.hjkey == key;
		        	}).forEach(function(item,i){
		        		updateColumnData(data,item.name);
		        	});
			    },
			    hjtdStyle:function(column,index){
			    	return {
			    		width:column.width&&column.width+"px"||"auto"
			    	}
			    },
			    setData:function(data){
					this.datasource = data;
					this.updatelist();
			    },
			    getData:function(){
			    	var list = this.datalist.map(function(item){
			    		return item;
			    	});
			        return JSON.parse(JSON.stringify(this.datasource));
			    }
		    })
		};
	}
	return function(option){
		return getOption(option);
	};
})