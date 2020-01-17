/**
 * 弹出菜单
 * 注意：该文件为源文件，禁止手动修改js文件
 */

(function($: any){
    var style_li = "list-style:none;padding: 5px; cursor: pointer; padding: 5px 20px;margin:0px;";
    var style_li_hover = style_li + "background-color: #00A0E9; color: #fff;";
    var style_container = "padding:0px;margin:0px;border: 1px solid #aaa;background-color: #fff;position: absolute;left: 0px;top: 0px;z-index: 2;display: none;";
    var style_ul = "margin: 0;padding: 0;"

    /**
     * 弹出菜单
     */
    class PopMenu {

        /** 构造函数 */ 
        constructor(
            options?: PopMenuOptions
        ) {
            this.container = $("<div style='"+ style_container +"'><ul style='"+ style_ul +"'></ul></div>")
            .appendTo(options.target||$(document.body))
            this.update(options);
            var _this = this;
            $(document).click(function(){
                _this.hide();
            });
        }

        /** 容器 */
        private container:JQuery<HTMLAnchorElement>

        private options: PopMenuOptions

        private addItem(item:PopMenuItem){var li = $("<li style='" + style_li + "'>" + item.text + "</li>")
            var _this = this;
            item.menu = this;
            $("<li style='" + style_li + "'>" + item.text + "</li>")
            .mouseenter(function() {
                $(this).attr("style", style_li_hover);
            })
            .mouseleave(function() {
                $(this).attr("style", style_li);
            })
            .click(function() {
                item.callback&&item.callback.call(item);
                _this.hide();
            }).appendTo(this.container.find("ul"))
        }

        private clear(){
            this.container.find("ul").empty();
        }

        public update(options?:PopMenuOptions):PopMenu {
            this.options = $.extend(this.options,options);
            var _this = this;
            this.clear();
            $(this.options.data).each(function(i:number, item:PopMenuItem) {
                _this.addItem(item);
            });
            return this;
        }

        public hide():PopMenu{
            this.container.hide();
            return this;
        }

        public show(x:number=0,y:number=0):PopMenu{
            if(arguments.length>=2){
                this.options.x = x;
                this.options.y = y;
            }
            this.container.css({
                "left": this.options.x.toString(),
                "top": this.options.y.toString(),
                "display":"inline-block"
            }).show();
            return this;
        }
    }
    class PopMenuItem{
        public text:string
        public callback: Function
        public menu: PopMenu
        constructor(
            text: string = "菜单",
            callback?: Function
        ) {
            this.text = text
            this.callback = callback;
        }
    }

    /** 配置对象 */
    interface PopMenuOptions {
        target:JQuery<HTMLElement>|HTMLElement|null
        data:Array<PopMenuItem>
        x:Number 
        y:Number
    }
    
    /**
    * 默认设置
    */
    class PopMenuDefaultOptions implements PopMenuOptions {
        data:Array<PopMenuItem>=[]
        target:JQuery<HTMLElement>|HTMLElement|null = null
        container:JQuery<HTMLElement>
        x:number = 0
        y:number = 0
    }
    
    $.fn.kjpopmenu = function(options ?: PopMenu) {
        return this;
    };

    $.kjpopmenu = function(options ?: PopMenuOptions){
        return new PopMenu(options);
    };
})(jQuery)
