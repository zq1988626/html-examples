var VelocityStatic;
(function (VelocityStatic) {
    var CSS;
    (function (CSS) {
        if (IE <= 8) {
            function opacity(element, propertyValue) {
                if (propertyValue === undefined) {
                    let filterValue = getPropertyValue(element, "filter"), extracted = filterValue.toString().match(/alpha\(opacity=(.*)\)/i);
                    return String(extracted ? parseInt(extracted[1]) / 100 : 1);
                }
                let value = parseFloat(propertyValue);
                setPropertyValue(element, "zoom", 1);
                setPropertyValue(element, "filter", value >= 1 ? "" : "alpha(opacity=" + Math.floor(value * 100) + ")");
                return true;
            }
            registerNormalization(["opacity", opacity]);
        }
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));
