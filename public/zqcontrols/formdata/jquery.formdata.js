(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== undefined) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(["jquery"],factory)
    } else {
        global.FormData = factory(jQuery);
    }
})(this, function ($) {
    return {
        getFormData:function(attrName){
            
        },
        setFormData:function(){

        }
    }
});