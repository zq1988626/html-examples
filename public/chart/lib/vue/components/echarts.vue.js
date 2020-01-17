define(["vue","echarts"],function(Vue,echarts){
	var defaultOption = {
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: []
	};
	var rev =  {
		name:'echarts',
		props:["option","height","width"],
		data:function(){
			return {
			}
		},
		mounted:function(){
			this.initChart();
		},

	    beforeDestroy () {
	      //组件销毁前先销毁 ECharts 实例
	      if (!this.chart) { return }
	      this.chart.dispose()
	      this.chart = null
	    },
	    
		created:function(){
			
		},
		computed:{
			mergeOption:function(){
				return echarts.util.merge(defaultOption,this.option) 
			}
		},
		methods:{
	        initChart:function(){
				this.chart = echarts.init(this.$el)
				this.chart.setOption(defaultOption)
				this.chart.setOption(this.option)
	        },
	        resize:function(){
	        	this.chart&&this.chart.resize();
	        }
		},
		
		template:[
			'<div :style="{height:this.height,width:this.width}"></div>'
		].join("\n")
	};
	return rev;
})