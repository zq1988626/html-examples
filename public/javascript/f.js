var win = window;

var F = window.F||window.parent.F||window.top.F||(function(){
    var F = {
        __extends:(function () {
            var extendStatics = function (sub, base) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (sub, base) { sub.__proto__ = base; }) ||
                    function (sub, base) { for (var p in base) if (base.hasOwnProperty(p)) sub[p] = base[p]; };
                return extendStatics(sub, base);
            }
            return function (sub, base) {
                extendStatics(sub, base);
                function __() { this.constructor = sub; }
                sub.prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new __());
            };
        })()
    }
    return F;
}())