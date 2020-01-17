"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easings_1 = require("./easings");
function registerBackIn(name, amount) {
    easings_1.registerEasing([name, (percentComplete, startValue, endValue) => {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount) * (endValue - startValue);
        }]);
}
exports.registerBackIn = registerBackIn;
function registerBackOut(name, amount) {
    easings_1.registerEasing([name, (percentComplete, startValue, endValue) => {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return (Math.pow(--percentComplete, 2) * ((amount + 1) * percentComplete + amount) + 1) * (endValue - startValue);
        }]);
}
exports.registerBackOut = registerBackOut;
function registerBackInOut(name, amount) {
    amount *= 1.525;
    easings_1.registerEasing([name, (percentComplete, startValue, endValue) => {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            percentComplete *= 2;
            return (percentComplete < 1
                ? (Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount))
                : (Math.pow(percentComplete - 2, 2) * ((amount + 1) * (percentComplete - 2) + amount) + 2)) * 0.5 * (endValue - startValue);
        }]);
}
exports.registerBackInOut = registerBackInOut;
registerBackIn("easeInBack", 1.7);
registerBackOut("easeOutBack", 1.7);
registerBackInOut("easeInOutBack", 1.7);
