"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_1 = require("../../velocity");
const data_1 = require("../data");
const normalizations_1 = require("../normalizations/normalizations");
const normalizationsObject_1 = require("../normalizations/normalizationsObject");
function setPropertyValue(element, propertyName, propertyValue, fn) {
    const noCache = normalizationsObject_1.NoCacheNormalizations.has(propertyName), data = !noCache && data_1.Data(element);
    if (noCache || (data && data.cache[propertyName] !== propertyValue)) {
        if (!noCache) {
            data.cache[propertyName] = propertyValue || undefined;
        }
        fn = fn || normalizations_1.getNormalization(element, propertyName);
        if (fn) {
            fn(element, propertyValue);
        }
        if (velocity_1.default.debug >= 2) {
            console.info(`Set "${propertyName}": "${propertyValue}"`, element);
        }
    }
}
exports.setPropertyValue = setPropertyValue;
