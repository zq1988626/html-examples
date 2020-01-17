"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = {};
function camelCase(property) {
    const fixed = cache[property];
    if (fixed) {
        return fixed;
    }
    return cache[property] = property.replace(/-([a-z])/g, ($, letter) => letter.toUpperCase());
}
exports.camelCase = camelCase;
