"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function addClass(element, className) {
    if (element instanceof Element) {
        if (element.classList) {
            element.classList.add(className);
        }
        else {
            removeClass(element, className);
            element.className += (element.className.length ? " " : "") + className;
        }
    }
}
exports.addClass = addClass;
function cloneArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike, 0);
}
exports.cloneArray = cloneArray;
function defineProperty(proto, name, value, readonly) {
    if (proto) {
        Object.defineProperty(proto, name, {
            configurable: !readonly,
            writable: !readonly,
            value,
        });
    }
}
exports.defineProperty = defineProperty;
function getValue(...args) {
    for (const arg of arguments) {
        if (arg !== undefined && arg === arg) {
            return arg;
        }
    }
}
exports.getValue = getValue;
exports.now = Date.now ? Date.now : () => {
    return (new Date()).getTime();
};
function removeClass(element, className) {
    if (element instanceof Element) {
        if (element.classList) {
            element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp(`(^|\\s)${className}(\\s|$)`, "gi"), " ");
        }
    }
}
exports.removeClass = removeClass;
function sanitizeElements(elements) {
    return types_1.isNode(elements)
        ? [elements]
        : elements;
}
exports.sanitizeElements = sanitizeElements;
