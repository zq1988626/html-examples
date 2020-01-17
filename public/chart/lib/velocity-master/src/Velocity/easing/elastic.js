"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easings_1 = require("./easings");
const PI2 = Math.PI * 2;
function registerElasticIn(name, amplitude, period) {
    easings_1.registerEasing([name, (percentComplete, startValue, endValue) => {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return -(amplitude * Math.pow(2, 10 * (percentComplete -= 1)) * Math.sin((percentComplete - (period / PI2 * Math.asin(1 / amplitude))) * PI2 / period)) * (endValue - startValue);
        }]);
}
exports.registerElasticIn = registerElasticIn;
function registerElasticOut(name, amplitude, period) {
    easings_1.registerEasing([name, (percentComplete, startValue, endValue) => {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return (amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - (period / PI2 * Math.asin(1 / amplitude))) * PI2 / period) + 1) * (endValue - startValue);
        }]);
}
exports.registerElasticOut = registerElasticOut;
function registerElasticInOut(name, amplitude, period) {
    easings_1.registerEasing([name, (percentComplete, startValue, endValue) => {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            const s = period / PI2 * Math.asin(1 / amplitude);
            percentComplete = percentComplete * 2 - 1;
            return (percentComplete < 0
                ? -0.5 * (amplitude * Math.pow(2, 10 * percentComplete) * Math.sin((percentComplete - s) * PI2 / period))
                : amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - s) * PI2 / period) * 0.5 + 1) * (endValue - startValue);
        }]);
}
exports.registerElasticInOut = registerElasticInOut;
registerElasticIn("easeInElastic", 1, 0.3);
registerElasticOut("easeOutElastic", 1, 0.3);
registerElasticInOut("easeInOutElastic", 1, 0.3 * 1.5);
