"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const actions_1 = require("../actions/actions");
exports.Easings = {};
function registerEasing(args) {
    const name = args[0], callback = args[1];
    if (!types_1.isString(name)) {
        console.warn(`VelocityJS: Trying to set 'registerEasing' name to an invalid value:`, name);
    }
    else if (!types_1.isFunction(callback)) {
        console.warn(`VelocityJS: Trying to set 'registerEasing' callback to an invalid value:`, name, callback);
    }
    else if (exports.Easings[name]) {
        console.warn(`VelocityJS: Trying to override 'registerEasing' callback`, name);
    }
    else {
        exports.Easings[name] = callback;
    }
}
exports.registerEasing = registerEasing;
actions_1.registerAction(["registerEasing", registerEasing], true);
function linearEasing(percentComplete, startValue, endValue, property) {
    return startValue + percentComplete * (endValue - startValue);
}
exports.linearEasing = linearEasing;
function swingEasing(percentComplete, startValue, endValue) {
    return startValue + (0.5 - Math.cos(percentComplete * Math.PI) / 2) * (endValue - startValue);
}
exports.swingEasing = swingEasing;
function springEasing(percentComplete, startValue, endValue) {
    return startValue + (1 - (Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6))) * (endValue - startValue);
}
exports.springEasing = springEasing;
registerEasing(["linear", linearEasing]);
registerEasing(["swing", swingEasing]);
registerEasing(["spring", springEasing]);
