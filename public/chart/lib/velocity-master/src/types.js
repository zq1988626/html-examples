"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isBoolean(variable) {
    return variable === true || variable === false;
}
exports.isBoolean = isBoolean;
function isEmptyObject(variable) {
    for (const name in variable) {
        if (variable.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
function isFunction(variable) {
    return Object.prototype.toString.call(variable) === "[object Function]";
}
exports.isFunction = isFunction;
function isNode(variable) {
    return !!(variable && variable.nodeType);
}
exports.isNode = isNode;
function isNumber(variable) {
    return typeof variable === "number";
}
exports.isNumber = isNumber;
function isNumberWhenParsed(variable) {
    return !isNaN(Number(variable));
}
exports.isNumberWhenParsed = isNumberWhenParsed;
function isPlainObject(variable) {
    if (!variable || typeof variable !== "object" || variable.nodeType || Object.prototype.toString.call(variable) !== "[object Object]") {
        return false;
    }
    const proto = Object.getPrototypeOf(variable);
    return !proto || (proto.hasOwnProperty("constructor") && proto.constructor === Object);
}
exports.isPlainObject = isPlainObject;
function isSVG(variable) {
    return SVGElement && variable instanceof SVGElement;
}
exports.isSVG = isSVG;
function isString(variable) {
    return typeof variable === "string";
}
exports.isString = isString;
function isVelocityResult(variable) {
    return variable && isNumber(variable.length) && isFunction(variable.velocity);
}
exports.isVelocityResult = isVelocityResult;
function isWrapped(variable) {
    return variable
        && variable !== window
        && isNumber(variable.length)
        && !isString(variable)
        && !isFunction(variable)
        && !isNode(variable)
        && (variable.length === 0 || isNode(variable[0]));
}
exports.isWrapped = isWrapped;
function propertyIsEnumerable(obj, property) {
    return Object.prototype.propertyIsEnumerable.call(obj, property);
}
exports.propertyIsEnumerable = propertyIsEnumerable;
