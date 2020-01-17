"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizations_1 = require("../normalizations");
function getDimension(name) {
    return ((element, propertyValue) => {
        if (propertyValue === undefined) {
            try {
                return element.getBBox()[name] + "px";
            }
            catch (e) {
                return "0px";
            }
        }
        element.setAttribute(name, propertyValue);
    });
}
normalizations_1.registerNormalization(["SVGElement", "width", getDimension("width")]);
normalizations_1.registerNormalization(["SVGElement", "height", getDimension("height")]);
