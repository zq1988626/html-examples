(function ($) {
    var style_li = "list-style:none;padding: 5px; cursor: pointer; padding: 5px 20px;margin:0px;";
    var style_li_hover = style_li + "background-color: #00A0E9; color: #fff;";
    var style_container = "padding:0px;margin:0px;border: 1px solid #aaa;background-color: #fff;position: absolute;left: 0px;top: 0px;z-index: 2;display: none;";
    var style_ul = "margin: 0;padding: 0;";
    var PopMenu = (function () {
        function PopMenu(options) {
            this.container = $("<div style='" + style_container + "'><ul style='" + style_ul + "'></ul></div>")
                .appendTo(options.target || $(document.body));
            this.update(options);
            var _this = this;
            $(document).click(function () {
                _this.hide();
            });
        }
        PopMenu.prototype.addItem = function (item) {
            var li = $("<li style='" + style_li + "'>" + item.text + "</li>");
            var _this = this;
            item.menu = this;
            $("<li style='" + style_li + "'>" + item.text + "</li>")
                .mouseenter(function () {
                $(this).attr("style", style_li_hover);
            })
                .mouseleave(function () {
                $(this).attr("style", style_li);
            })
                .click(function () {
                item.callback && item.callback.call(item);
                _this.hide();
            }).appendTo(this.container.find("ul"));
        };
        PopMenu.prototype.clear = function () {
            this.container.find("ul").empty();
        };
        PopMenu.prototype.update = function (options) {
            this.options = $.extend(this.options, options);
            var _this = this;
            this.clear();
            $(this.options.data).each(function (i, item) {
                _this.addItem(item);
            });
            return this;
        };
        PopMenu.prototype.hide = function () {
            this.container.hide();
            return this;
        };
        PopMenu.prototype.show = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (arguments.length >= 2) {
                this.options.x = x;
                this.options.y = y;
            }
            this.container.css({
                "left": this.options.x.toString(),
                "top": this.options.y.toString(),
                "display": "inline-block"
            }).show();
            return this;
        };
        return PopMenu;
    }());
    var PopMenuItem = (function () {
        function PopMenuItem(text, callback) {
            if (text === void 0) { text = "菜单"; }
            this.text = text;
            this.callback = callback;
        }
        return PopMenuItem;
    }());
    var PopMenuDefaultOptions = (function () {
        function PopMenuDefaultOptions() {
            this.data = [];
            this.target = null;
            this.x = 0;
            this.y = 0;
        }
        return PopMenuDefaultOptions;
    }());
    $.fn.kjpopmenu = function (options) {
        return this;
    };
    $.kjpopmenu = function (options) {
        return new PopMenu(options);
    };
})(jQuery);
