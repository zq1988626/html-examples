"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easings_1 = require("./easings");
function atStart(percentComplete, startValue, endValue) {
    return percentComplete === 0
        ? startValue
        : endValue;
}
exports.atStart = atStart;
function during(percentComplete, startValue, endValue) {
    return percentComplete === 0 || percentComplete === 1
        ? startValue
        : endValue;
}
exports.during = during;
function atEnd(percentComplete, startValue, endValue) {
    return percentComplete === 1
        ? endValue
        : startValue;
}
exports.atEnd = atEnd;
easings_1.registerEasing(["at-start", atStart]);
easings_1.registerEasing(["during", during]);
easings_1.registerEasing(["at-end", atEnd]);
