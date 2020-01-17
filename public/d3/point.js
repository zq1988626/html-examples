var D3BA;
(function (D3BA) {
    var A1 = (function () {
        function A1(message) {
        }
        A1.prototype.init = function (box) {
            this.width = $(box).width();
            this.height = $(box).width();
            this.container = box;
        };
        A1.prototype.resize = function () {
            this.width = $(this.$container).width();
            this.height = $(this.$container).width();
        };
        A1.setting = {
            property: "333"
        };
        return A1;
    }());
    D3BA.A1 = A1;
})(D3BA || (D3BA = {}));
