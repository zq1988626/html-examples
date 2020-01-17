/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
/**
 * Cache every camelCase match to avoid repeating lookups.
 */
const cache = {};
/**
 * Camelcase a property name into its JavaScript notation (e.g.
 * "background-color" ==> "backgroundColor"). Camelcasing is used to
 * normalize property names between and across calls.
 */
export function camelCase(property) {
    const fixed = cache[property];
    if (fixed) {
        return fixed;
    }
    return cache[property] = property.replace(/-([a-z])/g, ($, letter) => letter.toUpperCase());
}
//# sourceMappingURL=camelCase.js.map