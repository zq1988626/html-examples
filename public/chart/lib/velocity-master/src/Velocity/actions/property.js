"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const fixColors_1 = require("../css/fixColors");
const getPropertyValue_1 = require("../css/getPropertyValue");
const setPropertyValue_1 = require("../css/setPropertyValue");
const actions_1 = require("./actions");
function propertyAction(args, elements, promiseHandler, action) {
    const property = args[0], value = args[1];
    if (!property) {
        console.warn(`VelocityJS: Cannot access a non-existant property!`);
        return null;
    }
    if (value === undefined && !types_1.isPlainObject(property)) {
        if (Array.isArray(property)) {
            if (elements.length === 1) {
                const result = {};
                for (const prop of property) {
                    result[prop] = fixColors_1.fixColors(getPropertyValue_1.getPropertyValue(elements[0], prop));
                }
                return result;
            }
            else {
                const result = [];
                for (const element of elements) {
                    const res = {};
                    for (const prop of property) {
                        res[prop] = fixColors_1.fixColors(getPropertyValue_1.getPropertyValue(element, prop));
                    }
                    result.push(res);
                }
                return result;
            }
        }
        else {
            if (elements.length === 1) {
                return fixColors_1.fixColors(getPropertyValue_1.getPropertyValue(elements[0], property));
            }
            const result = [];
            for (const element of elements) {
                result.push(fixColors_1.fixColors(getPropertyValue_1.getPropertyValue(element, property)));
            }
            return result;
        }
    }
    const error = [];
    if (types_1.isPlainObject(property)) {
        for (const propertyName in property) {
            if (property.hasOwnProperty(propertyName)) {
                for (const element of elements) {
                    const propertyValue = property[propertyName];
                    if (types_1.isString(propertyValue) || types_1.isNumber(propertyValue)) {
                        setPropertyValue_1.setPropertyValue(element, propertyName, property[propertyName]);
                    }
                    else {
                        error.push(`Cannot set a property "${propertyName}" to an unknown type: ${typeof propertyValue}`);
                        console.warn(`VelocityJS: Cannot set a property "${propertyName}" to an unknown type:`, propertyValue);
                    }
                }
            }
        }
    }
    else if (types_1.isString(value) || types_1.isNumber(value)) {
        for (const element of elements) {
            setPropertyValue_1.setPropertyValue(element, property, String(value));
        }
    }
    else {
        error.push(`Cannot set a property "${property}" to an unknown type: ${typeof value}`);
        console.warn(`VelocityJS: Cannot set a property "${property}" to an unknown type:`, value);
    }
    if (promiseHandler) {
        if (error.length) {
            promiseHandler._rejecter(error.join(", "));
        }
        else if (types_1.isVelocityResult(elements) && elements.velocity.animations && elements.then) {
            elements.then(promiseHandler._resolver);
        }
        else {
            promiseHandler._resolver(elements);
        }
    }
}
exports.propertyAction = propertyAction;
actions_1.registerAction(["property", propertyAction], true);
