;define(["controllers/base","vue","lib/vue/loader"],
function(base,Vue,treeGrid){
	
	return F.class(base,{
		name:"treetable-demo",
		
		bindEvent:function(){
		},
		
		initTable:function(){
			var _this = this;
			_this.controls.grid.value([
		        {myid:"mz",mypid:null,open:1,myname: '煤种1',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001",mypid:"mz",myname: '煤种1',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001001",mypid:"001",myname: '煤种11',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001001001",mypid:"001001",myname: '煤种111',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001001002",mypid:"001001",myname: '煤种112',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001002",mypid:"001",myname: '煤种12',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001002001",mypid:"001002",myname: '煤种121',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001002002",mypid:"001002",myname: '煤种122',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001002003",mypid:"001002",myname: '煤种123',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"001002004",mypid:"001002",myname: '煤种124',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"002",mypid:"mz",myname: '煤种2',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"002001",mypid:"002",myname: '煤种21',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"002002",mypid:"002",myname: '煤种22',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"003",mypid:"mz",myname: '煤种3',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"004",mypid:"mz",myname: '煤种4',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100},
		        {myid:"004001",mypid:"004",myname: '煤种41',sl: 1000,rz: 22,lf:0.12,hff:0.5,ml:100}
			]);
			
			_this.controls.grid.vueobj.bind("cellChange",function(){
				alert(1);
			})
		},
		
		onLoad:function(){
			this.bindEvent();
			this.initTable();
		}
	})
});