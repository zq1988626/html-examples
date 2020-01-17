"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const augmentDimension_1 = require("../css/augmentDimension");
const setPropertyValue_1 = require("../css/setPropertyValue");
const normalizations_1 = require("./normalizations");
function getDimension(name, wantInner) {
    return ((element, propertyValue) => {
        if (propertyValue === undefined) {
            return augmentDimension_1.augmentDimension(element, name, wantInner) + "px";
        }
        setPropertyValue_1.setPropertyValue(element, name, (parseFloat(propertyValue) - augmentDimension_1.augmentDimension(element, name, wantInner)) + "px");
    });
}
normalizations_1.registerNormalization(["Element", "innerWidth", getDimension("width", true)]);
normalizations_1.registerNormalization(["Element", "innerHeight", getDimension("height", true)]);
normalizations_1.registerNormalization(["Element", "outerWidth", getDimension("width", false)]);
normalizations_1.registerNormalization(["Element", "outerHeight", getDimension("height", false)]);
