"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easings_1 = require("./easings");
function easeOutBouncePercent(percentComplete) {
    if (percentComplete < 1 / 2.75) {
        return (7.5625 * percentComplete * percentComplete);
    }
    if (percentComplete < 2 / 2.75) {
        return (7.5625 * (percentComplete -= 1.5 / 2.75) * percentComplete + 0.75);
    }
    if (percentComplete < 2.5 / 2.75) {
        return (7.5625 * (percentComplete -= 2.25 / 2.75) * percentComplete + 0.9375);
    }
    return (7.5625 * (percentComplete -= 2.625 / 2.75) * percentComplete + 0.984375);
}
function easeInBouncePercent(percentComplete) {
    return 1 - easeOutBouncePercent(1 - percentComplete);
}
function easeInBounce(percentComplete, startValue, endValue) {
    if (percentComplete === 0) {
        return startValue;
    }
    if (percentComplete === 1) {
        return endValue;
    }
    return easeInBouncePercent(percentComplete) * (endValue - startValue);
}
exports.easeInBounce = easeInBounce;
function easeOutBounce(percentComplete, startValue, endValue) {
    if (percentComplete === 0) {
        return startValue;
    }
    if (percentComplete === 1) {
        return endValue;
    }
    return easeOutBouncePercent(percentComplete) * (endValue - startValue);
}
exports.easeOutBounce = easeOutBounce;
function easeInOutBounce(percentComplete, startValue, endValue) {
    if (percentComplete === 0) {
        return startValue;
    }
    if (percentComplete === 1) {
        return endValue;
    }
    return (percentComplete < 0.5
        ? easeInBouncePercent(percentComplete * 2) * 0.5
        : easeOutBouncePercent(percentComplete * 2 - 1) * 0.5 + 0.5) * (endValue - startValue);
}
exports.easeInOutBounce = easeInOutBounce;
easings_1.registerEasing(["easeInBounce", easeInBounce]);
easings_1.registerEasing(["easeOutBounce", easeOutBounce]);
easings_1.registerEasing(["easeInOutBounce", easeInOutBounce]);
