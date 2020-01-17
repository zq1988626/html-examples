(function($){
	var html = "<div class='fcp_tooltip'></div>";
	
	var ToolTip = function(parent){
		this.element = $(html).appendTo($(parent));
		this.control = "ptooltip";
	}
	
	ToolTip.prototype = {
		constructor:ToolTip,
		show:function(msg,left,top){
			if(left&&top){
				this.move(left,top);
			}
			this.element.html(msg).show();
		},
		move:function(left,top){
			this.element.css({left:left,top:top});
		},
		hide:function(){
			this.element.hide();
		}
	}
	
	$.fn.ptooltip = function(){
		return new ToolTip(this.eq(0));
	}
})(jQuery);
