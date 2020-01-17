/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Runtime type checking methods.
 */
/**
 * Check if a variable is a boolean.
 */
export function isBoolean(variable) {
    return variable === true || variable === false;
}
/**
 * Check if a variable is an empty object.
 */
export function isEmptyObject(variable) {
    for (const name in variable) {
        if (variable.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}
/**
 * Check if a variable is a function.
 */
export function isFunction(variable) {
    return Object.prototype.toString.call(variable) === "[object Function]";
}
/**
 * Check if a variable is an HTMLElement or SVGElement.
 */
export function isNode(variable) {
    return !!(variable && variable.nodeType);
}
/**
 * Check if a variable is a number.
 */
export function isNumber(variable) {
    return typeof variable === "number";
}
/**
 * Faster way to parse a string/number as a number https://jsperf.com/number-vs-parseint-vs-plus/3
 */
export function isNumberWhenParsed(variable) {
    return !isNaN(Number(variable));
}
/**
 * Check if a variable is a plain object (and not an instance).
 */
export function isPlainObject(variable) {
    if (!variable || typeof variable !== "object" || variable.nodeType || Object.prototype.toString.call(variable) !== "[object Object]") {
        return false;
    }
    const proto = Object.getPrototypeOf(variable);
    return !proto || (proto.hasOwnProperty("constructor") && proto.constructor === Object);
}
/**
 * Check if a variable is an SVGElement.
 */
export function isSVG(variable) {
    return SVGElement && variable instanceof SVGElement;
}
/**
 * Check if a variable is a string.
 */
export function isString(variable) {
    return typeof variable === "string";
}
/**
 * Check if a variable is the result of calling Velocity.
 */
export function isVelocityResult(variable) {
    return variable && isNumber(variable.length) && isFunction(variable.velocity);
}
/**
 * Check if a variable is an array-like wrapped jQuery, Zepto or similar, where
 * each indexed value is a Node.
 */
export function isWrapped(variable) {
    return variable
        && variable !== window
        && isNumber(variable.length)
        && !isString(variable)
        && !isFunction(variable)
        && !isNode(variable)
        && (variable.length === 0 || isNode(variable[0]));
}
/**
 * Check is a property is an enumerable member of an object.
 */
export function propertyIsEnumerable(obj, property) {
    return Object.prototype.propertyIsEnumerable.call(obj, property);
}
//# sourceMappingURL=types.js.map