"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = {};
function generateStep(steps) {
    const fn = cache[steps];
    if (fn) {
        return fn;
    }
    return cache[steps] = (percentComplete, startValue, endValue) => {
        if (percentComplete === 0) {
            return startValue;
        }
        if (percentComplete === 1) {
            return endValue;
        }
        return startValue + Math.round(percentComplete * steps) * (1 / steps) * (endValue - startValue);
    };
}
exports.generateStep = generateStep;
