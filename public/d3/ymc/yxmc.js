!function(){
	var Donut3D={};
	
	function pieTop(d, rx, ry, ir ){
		if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
		var sx = rx*Math.cos(d.startAngle),
			sy = ry*Math.sin(d.startAngle),
			ex = rx*Math.cos(d.endAngle),
			ey = ry*Math.sin(d.endAngle);
			
		var ret =[];
		ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
		ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
		return ret.join(" ");
	}

	function pieOuter(d, rx, ry, h ){
		
		var ret =[];
		var startAngle = d.startAngle;
		var endAngle = d.endAngle;
		
		var PI2 = Math.PI*2;
		var PI = Math.PI;
		
		var ov = parseInt(startAngle/PI2)*PI2;
		if(ov<0 || (ov==0 && startAngle<0)){ov-=PI2};
		var startAngle = startAngle-ov;
		var endAngle = endAngle - ov;
		
		if( startAngle<=PI){
			if(endAngle>PI&&endAngle<PI2){
				endAngle=PI
			}
			else if(endAngle>=PI2){
				
				var s2 = PI2;
				var e2 = endAngle;
				endAngle=PI
				
				var sx2 = rx*Math.cos(s2),
					sy2 = ry*Math.sin(s2),
					ex2 = rx*Math.cos(e2),
					ey2 = ry*Math.sin(e2);
					ret.push("M",sx2,h+sy2,"A",rx,ry,"0 0 1",ex2,h+ey2,"L",ex2,ey2,"A",rx,ry,"0 0 0",sx2,sy2);
				
				var sx = rx*Math.cos(startAngle),
					sy = ry*Math.sin(startAngle),
					ex = rx*Math.cos(endAngle),
					ey = ry*Math.sin(endAngle);
					ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy);
					return ret.join(" ");
			}
		}
		else if( startAngle>PI && startAngle<PI2){
			if(endAngle>PI&&endAngle<=PI2){
				startAngle=PI;
				endAngle=PI;
			}
			else if(endAngle>PI2&&endAngle<(PI2+PI)){
				startAngle=PI2;
			}
			else{
				startAngle=PI2;
				endAngle=PI2+PI;
			}
		}
		
		var sx = rx*Math.cos(startAngle),
			sy = ry*Math.sin(startAngle),
			ex = rx*Math.cos(endAngle),
			ey = ry*Math.sin(endAngle);
			ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
			return ret.join(" ");
	}

	function pieInner(d, rx, ry, h, ir ){
		var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
		
		var sx = ir*rx*Math.cos(startAngle),
			sy = ir*ry*Math.sin(startAngle),
			ex = ir*rx*Math.cos(endAngle),
			ey = ir*ry*Math.sin(endAngle);

			var ret =[];
			ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
			return ret.join(" ");
	}

	function getPercent(d){
		return (d.endAngle-d.startAngle > 0.2 ? 
				Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
	}	
	
	Donut3D.transition = function(id, data, rx, ry, h, ir,startAngel){
		var btndata = {data:data,rx:rx,ry:ry,h:h,ir:ir,startAngel:startAngel};
		d3.select("#"+ id +" .btn_left")._data=btndata;
		d3.select("#"+ id +" .btn_right")._data=btndata;
		
		var svg = d3.select("#"+ id +" .quotesDonut");
		function arcTweenInner(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return pieInner(i(t), rx+0.5, ry+0.5, h, ir);  };
		}
		function arcTweenTop(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return pieTop(i(t), rx, ry, ir);  };
		}
		function arcTweenOuter(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return pieOuter(i(t), rx-.5, ry-.5, h);  };
		}
		function textTweenX(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return 0.3*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
		}
		function textTweenY(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return 0.3*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
		}
		
		var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
		_data.forEach(function(item){
			item.startAngle += startAngel;
			item.endAngle+= startAngel;
		})
		
		svg.selectAll(".innerSlice").data(_data)
			.transition().duration(500).attrTween("d", arcTweenInner);
			
		svg.selectAll(".outerSlice").data(_data)
			.transition().duration(500).attrTween("d", arcTweenOuter); 	
		

		svg.selectAll(".topSlice").data(_data)
			.transition().duration(500).attrTween("d", arcTweenTop); 

		return;
		svg.selectAll(".percent").data(_data)
			.transition().duration(500)
			.attrTween("x",textTweenX).attrTween("y",textTweenY).text(getPercent); 	
	}
	
	Donut3D.draw=function(id, data,
			rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/
			,formatter,clickcallback
	){
		//var svg = d3.select("#"+id);
		
		var tooltipbox = $("#_Donut3dToolTip");
		if(tooltipbox.length==0){
			tooltipbox = $('<div id="_Donut3dToolTip"></div>')
			.appendTo($("body"));
		};
		
		
		var svg = d3.select("#"+ id +" .quotesDonut");
		
		var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
		
		var slices = svg;
		var clickcallback =clickcallback?clickcallback: function(d){
		}
		
		var showtooltip = function(html,offset){
			var mouse = d3.mouse(window.document.body);
			var svgpos = {left:10,top:10};
			var pos = {left:svgpos.left+mouse[0],top:svgpos.top+mouse[1]};
			if(offset){
				pos=offset(pos);
			}
			tooltipbox.css(pos).html(html).show();
		}
		var hidetooltip=function(){
			tooltipbox.hide();
		}
		
		var mouseovercallback = function(e){
			showtooltip(formatter(this._current.data),function(pos){
				pos.top-=tooltipbox.outerHeight()/2;
				if(pos.left>$(document).width()/2){
					pos.left-=(20+tooltipbox.outerWidth());
				}
				return pos;
			});
		}
		var mouseoutcallback = function(e){
			hidetooltip();
		}
		
		var _this = this;
		var btndata = {id:id,data:data,rx:rx,ry:ry,h:h,ir:ir,startAngel:0};
		var btn_left = d3.select("#"+ id +" .btn_left");
		var btn_right = d3.select("#"+ id +" .btn_right");
		var kdptransform = d3.select("#"+ id +" .kdptransform");
		btn_left[0][0]._data=btndata;
		btn_right[0][0]._data=btndata;
		btn_left.on("click",function(){
			var d = this._data;
			d.startAngel+=(Math.PI/6);
			_this.transition(d.id,d.data,d.rx,d.ry,d.h,d.ir,d.startAngel);
			kdptransform.transition().duration(500).attr("transform", "rotate("+(d.startAngel/Math.PI/2*360)+" 0 0)");
		}).on("mousemove",function(){
			showtooltip("向左转",function(pos){pos.left +=10;pos.top -=10;return pos;});
		}).on("mouseout",hidetooltip);
		btn_right.on("click",function(d){
			var d = this._data;
			d.startAngel-=(Math.PI/6);
			_this.transition(d.id,d.data,d.rx,d.ry,d.h,d.ir,d.startAngel);
			kdptransform.transition().duration(500).attr("transform", "rotate("+(d.startAngel/Math.PI/2*360)+" 0 0)");
		}).on("mousemove",function(){
			showtooltip("向右转",function(pos){pos.left +=10;pos.top -=10;return pos;});
		}).on("mouseout",hidetooltip);
		
		//外边框
		slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.9); })
			.attr("_id",function(d){return d.data.class})
			.attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
			.on("click",clickcallback)
			.on("mousemove",mouseovercallback)
			.on("mouseout",mouseoutcallback)
			.each(function(d){this._current=d; this._a=1;});
		
			
		slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
			.attr("_id",function(d){return d.data.class})
			.attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
			.on("click",clickcallback)
			.on("mousemove",mouseovercallback)
			.on("mouseout",mouseoutcallback)
			.each(function(d){this._current=d;});

		slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
			.style("fill", function(d) { return d.data.color; })
			.attr("_id",function(d){return d.data.class})
			.style("stroke", function(d) { return d.data.color; })
			.attr("d",function(d){ return pieTop(d, rx, ry, ir);})
			.on("click",clickcallback)
			.on("mousemove",mouseovercallback)
			.on("mouseout",mouseoutcallback)
			.each(function(d){this._current=d;});
			
		//文字
		return;
		slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
			.attr("_id",function(d){return d.data.class})
			.attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
			.attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
			.on("click",clickcallback)
			.on("mousemove",mouseovercallback)
			.on("mouseout",mouseoutcallback)
			.text(getPercent).each(function(d){this._current=d;});
		

	}
	
	Donut3D.drawTitle = function(id,title){
		var legends = d3.select("#"+ id +" .title")
		legends.text(title.text);
		if(title.x){
			legends.attr("x",title.x);
		}
	}
			
	Donut3D.drawLegend = function(id,data){
		var legends = d3.select("#"+ id +" .legends")
		var i =0;
		legends.attr("transform", "translate(0 "+(600-data.length*20)+")" )
		.selectAll(".legend")
		.data(data).enter().append("g")
		.attr("class", "legend")
		.attr("x", "0").attr("y", "0")
		.style("fill", function(d) { return d.color; })
		.attr("transform", function(d){return "translate(0 "+ ((i++)*20) +")";})
		.each(function(d){
			var _this = d3.select(this);
			_this.append("rect")
			.text(function(d){return d.label})
			.attr("x", "0").attr("y", "0")
			.attr("width", "20").attr("height", "15")
			_this.append("text")
			.text(function(d){return d.label})
			.attr("x", "30").attr("y", "12")
		});
		
		return;
		svg.data(data).enter().append("g").append("g").attr("class", "outerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.9); })
			.attr("_id",function(d){return d.data.class})
			.attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
			.each(function(d){this._current=d; this._a=1;});
	}
	
	this.Donut3D = Donut3D;
}();
