"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizations_1 = require("./normalizations");
function getSetTween(element, propertyValue) {
    if (propertyValue === undefined) {
        return "";
    }
}
normalizations_1.registerNormalization(["Element", "tween", getSetTween]);
