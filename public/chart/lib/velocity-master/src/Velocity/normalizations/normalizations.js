"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const actions_1 = require("../actions/actions");
const data_1 = require("../data");
const normalizationsObject_1 = require("./normalizationsObject");
function registerNormalization(args) {
    const constructor = args[0], name = args[1], callback = args[2];
    if ((types_1.isString(constructor) && !(window[constructor] instanceof Object))
        || (!types_1.isString(constructor) && !(constructor instanceof Object))) {
        console.warn(`VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value:`, constructor);
    }
    else if (!types_1.isString(name)) {
        console.warn(`VelocityJS: Trying to set 'registerNormalization' name to an invalid value:`, name);
    }
    else if (!types_1.isFunction(callback)) {
        console.warn(`VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:`, name, callback);
    }
    else {
        let index = normalizationsObject_1.constructors.indexOf(constructor), nextArg = 3;
        if (index < 0 && !types_1.isString(constructor)) {
            if (normalizationsObject_1.constructorCache.has(constructor)) {
                index = normalizationsObject_1.constructors.indexOf(normalizationsObject_1.constructorCache.get(constructor));
            }
            else {
                for (const property in window) {
                    if (window[property] === constructor) {
                        index = normalizationsObject_1.constructors.indexOf(property);
                        if (index < 0) {
                            index = normalizationsObject_1.constructors.push(property) - 1;
                            normalizationsObject_1.Normalizations[index] = {};
                            normalizationsObject_1.constructorCache.set(constructor, property);
                        }
                        break;
                    }
                }
            }
        }
        if (index < 0) {
            index = normalizationsObject_1.constructors.push(constructor) - 1;
            normalizationsObject_1.Normalizations[index] = {};
        }
        normalizationsObject_1.Normalizations[index][name] = callback;
        if (types_1.isString(args[nextArg])) {
            const unit = args[nextArg++];
            let units = normalizationsObject_1.NormalizationUnits[unit];
            if (!units) {
                units = normalizationsObject_1.NormalizationUnits[unit] = [];
            }
            units.push(callback);
        }
        if (args[nextArg] === false) {
            normalizationsObject_1.NoCacheNormalizations.add(name);
        }
    }
}
exports.registerNormalization = registerNormalization;
function hasNormalization(args) {
    const constructor = args[0], name = args[1];
    let index = normalizationsObject_1.constructors.indexOf(constructor);
    if (index < 0 && !types_1.isString(constructor)) {
        if (normalizationsObject_1.constructorCache.has(constructor)) {
            index = normalizationsObject_1.constructors.indexOf(normalizationsObject_1.constructorCache.get(constructor));
        }
        else {
            for (const property in window) {
                if (window[property] === constructor) {
                    index = normalizationsObject_1.constructors.indexOf(property);
                    break;
                }
            }
        }
    }
    return index >= 0 && normalizationsObject_1.Normalizations[index].hasOwnProperty(name);
}
exports.hasNormalization = hasNormalization;
function getNormalizationUnit(fn) {
    for (const unit in normalizationsObject_1.NormalizationUnits) {
        if (normalizationsObject_1.NormalizationUnits[unit].includes(fn)) {
            return unit;
        }
    }
    return "";
}
exports.getNormalizationUnit = getNormalizationUnit;
function getNormalization(element, propertyName) {
    const data = data_1.Data(element);
    let fn;
    for (let index = normalizationsObject_1.constructors.length - 1, types = data.types; !fn && index >= 0; index--) {
        if (types & (1 << index)) {
            fn = normalizationsObject_1.Normalizations[index][propertyName];
        }
    }
    return fn;
}
exports.getNormalization = getNormalization;
actions_1.registerAction(["registerNormalization", registerNormalization]);
actions_1.registerAction(["hasNormalization", hasNormalization]);
