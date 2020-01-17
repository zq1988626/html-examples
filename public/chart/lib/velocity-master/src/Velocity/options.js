"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const types_1 = require("../types");
const bezier_1 = require("./easing/bezier");
const easings_1 = require("./easing/easings");
const spring_rk4_1 = require("./easing/spring_rk4");
const step_1 = require("./easing/step");
function parseDuration(duration, def) {
    if (types_1.isNumber(duration)) {
        return duration;
    }
    if (types_1.isString(duration)) {
        return constants_1.Duration[duration.toLowerCase()]
            || parseFloat(duration.replace("ms", "")
                .replace("s", "000"));
    }
    return def == null ? undefined : parseDuration(def);
}
exports.parseDuration = parseDuration;
function validateCache(value) {
    if (types_1.isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'cache' to an invalid value:`, value);
    }
}
exports.validateCache = validateCache;
function validateBegin(value) {
    if (types_1.isFunction(value)) {
        return value;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'begin' to an invalid value:`, value);
    }
}
exports.validateBegin = validateBegin;
function validateComplete(value, noError) {
    if (types_1.isFunction(value)) {
        return value;
    }
    if (value != null && !noError) {
        console.warn(`VelocityJS: Trying to set 'complete' to an invalid value:`, value);
    }
}
exports.validateComplete = validateComplete;
function validateDelay(value) {
    const parsed = parseDuration(value);
    if (!isNaN(parsed)) {
        return parsed;
    }
    if (value != null) {
        console.error(`VelocityJS: Trying to set 'delay' to an invalid value:`, value);
    }
}
exports.validateDelay = validateDelay;
function validateDuration(value, noError) {
    const parsed = parseDuration(value);
    if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
    }
    if (value != null && !noError) {
        console.error(`VelocityJS: Trying to set 'duration' to an invalid value:`, value);
    }
}
exports.validateDuration = validateDuration;
function validateEasing(value, duration, noError) {
    if (types_1.isString(value)) {
        return easings_1.Easings[value];
    }
    if (types_1.isFunction(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        if (value.length === 1) {
            return step_1.generateStep(value[0]);
        }
        if (value.length === 2) {
            return spring_rk4_1.generateSpringRK4(value[0], value[1], duration);
        }
        if (value.length === 4) {
            return bezier_1.generateBezier.apply(null, value) || false;
        }
    }
    if (value != null && !noError) {
        console.error(`VelocityJS: Trying to set 'easing' to an invalid value:`, value);
    }
}
exports.validateEasing = validateEasing;
function validateFpsLimit(value) {
    if (value === false) {
        return 0;
    }
    else {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0) {
            return Math.min(parsed, 60);
        }
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'fpsLimit' to an invalid value:`, value);
    }
}
exports.validateFpsLimit = validateFpsLimit;
function validateLoop(value) {
    switch (value) {
        case false:
            return 0;
        case true:
            return true;
        default:
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed >= 0) {
                return parsed;
            }
            break;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'loop' to an invalid value:`, value);
    }
}
exports.validateLoop = validateLoop;
function validateProgress(value) {
    if (types_1.isFunction(value)) {
        return value;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'progress' to an invalid value:`, value);
    }
}
exports.validateProgress = validateProgress;
function validatePromise(value) {
    if (types_1.isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'promise' to an invalid value:`, value);
    }
}
exports.validatePromise = validatePromise;
function validatePromiseRejectEmpty(value) {
    if (types_1.isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'promiseRejectEmpty' to an invalid value:`, value);
    }
}
exports.validatePromiseRejectEmpty = validatePromiseRejectEmpty;
function validateQueue(value, noError) {
    if (value === false || types_1.isString(value)) {
        return value;
    }
    if (value != null && !noError) {
        console.warn(`VelocityJS: Trying to set 'queue' to an invalid value:`, value);
    }
}
exports.validateQueue = validateQueue;
function validateRepeat(value) {
    switch (value) {
        case false:
            return 0;
        case true:
            return true;
        default:
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed >= 0) {
                return parsed;
            }
            break;
    }
    if (value != null) {
        console.warn(`VelocityJS: Trying to set 'repeat' to an invalid value:`, value);
    }
}
exports.validateRepeat = validateRepeat;
function validateSpeed(value) {
    if (types_1.isNumber(value)) {
        return value;
    }
    if (value != null) {
        console.error(`VelocityJS: Trying to set 'speed' to an invalid value:`, value);
    }
}
exports.validateSpeed = validateSpeed;
function validateSync(value) {
    if (types_1.isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.error(`VelocityJS: Trying to set 'sync' to an invalid value:`, value);
    }
}
exports.validateSync = validateSync;
