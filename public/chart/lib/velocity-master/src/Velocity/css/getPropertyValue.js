"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_1 = require("../../velocity");
const data_1 = require("../data");
const normalizations_1 = require("../normalizations/normalizations");
const normalizationsObject_1 = require("../normalizations/normalizationsObject");
const augmentDimension_1 = require("./augmentDimension");
const setPropertyValue_1 = require("./setPropertyValue");
function getWidthHeight(element, property) {
    return (element.getBoundingClientRect()[property] + augmentDimension_1.augmentDimension(element, property, true)) + "px";
}
function computePropertyValue(element, property) {
    const data = data_1.Data(element), computedStyle = data.computedStyle ? data.computedStyle : data.window.getComputedStyle(element, null);
    let computedValue = 0;
    if (!data.computedStyle) {
        data.computedStyle = computedStyle;
    }
    if (computedStyle["display"] === "none") {
        switch (property) {
            case "width":
            case "height":
                setPropertyValue_1.setPropertyValue(element, "display", "auto");
                computedValue = getWidthHeight(element, property);
                setPropertyValue_1.setPropertyValue(element, "display", "none");
                return String(computedValue);
        }
    }
    computedValue = computedStyle[property];
    if (!computedValue) {
        computedValue = element.style[property];
    }
    if (computedValue === "auto") {
        switch (property) {
            case "width":
            case "height":
                computedValue = getWidthHeight(element, property);
                break;
            case "top":
            case "left":
                const topLeft = true;
            case "right":
            case "bottom":
                const position = getPropertyValue(element, "position");
                if (position === "fixed" || (topLeft && position === "absolute")) {
                    computedValue = element.getBoundingClientRect[property] + "px";
                    break;
                }
            default:
                computedValue = "0px";
                break;
        }
    }
    return computedValue ? String(computedValue) : "";
}
exports.computePropertyValue = computePropertyValue;
function getPropertyValue(element, propertyName, fn, skipCache) {
    const data = data_1.Data(element);
    let propertyValue;
    if (normalizationsObject_1.NoCacheNormalizations.has(propertyName)) {
        skipCache = true;
    }
    if (!skipCache && data && data.cache[propertyName] != null) {
        propertyValue = data.cache[propertyName];
    }
    else {
        fn = fn || normalizations_1.getNormalization(element, propertyName);
        if (fn) {
            propertyValue = fn(element);
            if (data) {
                data.cache[propertyName] = propertyValue;
            }
        }
    }
    if (velocity_1.default.debug >= 2) {
        console.info(`Get "${propertyName}": "${propertyValue}"`, element);
    }
    return propertyValue;
}
exports.getPropertyValue = getPropertyValue;
