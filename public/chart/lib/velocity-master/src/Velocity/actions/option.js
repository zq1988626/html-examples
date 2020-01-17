"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utility_1 = require("../../utility");
const defaults_1 = require("../defaults");
const options_1 = require("../options");
const state_1 = require("../state");
const tick_1 = require("../tick");
const actions_1 = require("./actions");
const animationFlags = {
    isExpanded: 1,
    isReady: 2,
    isStarted: 4,
    isStopped: 8,
    isPaused: 16,
    isSync: 32,
    isReverse: 64,
};
function option(args, elements, promiseHandler, action) {
    const key = args[0], queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined, queueName = queue === "false" ? false : options_1.validateQueue(queue, true);
    let animations, value = args[1];
    if (!key) {
        console.warn(`VelocityJS: Cannot access a non-existant key!`);
        return null;
    }
    if (types_1.isVelocityResult(elements) && elements.velocity.animations) {
        animations = elements.velocity.animations;
    }
    else {
        animations = [];
        for (let activeCall = state_1.State.first; activeCall; activeCall = activeCall._next) {
            if (elements.indexOf(activeCall.element) >= 0 && utility_1.getValue(activeCall.queue, activeCall.options.queue) === queueName) {
                animations.push(activeCall);
            }
        }
        if (elements.length > 1 && animations.length > 1) {
            let i = 1, options = animations[0].options;
            while (i < animations.length) {
                if (animations[i++].options !== options) {
                    options = null;
                    break;
                }
            }
            if (options) {
                animations = [animations[0]];
            }
        }
    }
    if (value === undefined) {
        const result = [], flag = animationFlags[key];
        for (const animation of animations) {
            if (flag === undefined) {
                result.push(utility_1.getValue(animation[key], animation.options[key]));
            }
            else {
                result.push((animation._flags & flag) === 0);
            }
        }
        if (elements.length === 1 && animations.length === 1) {
            return result[0];
        }
        return result;
    }
    let isPercentComplete;
    switch (key) {
        case "cache":
            value = options_1.validateCache(value);
            break;
        case "begin":
            value = options_1.validateBegin(value);
            break;
        case "complete":
            value = options_1.validateComplete(value);
            break;
        case "delay":
            value = options_1.validateDelay(value);
            break;
        case "duration":
            value = options_1.validateDuration(value);
            break;
        case "fpsLimit":
            value = options_1.validateFpsLimit(value);
            break;
        case "loop":
            value = options_1.validateLoop(value);
            break;
        case "percentComplete":
            isPercentComplete = true;
            value = parseFloat(value);
            break;
        case "repeat":
        case "repeatAgain":
            value = options_1.validateRepeat(value);
            break;
        default:
            if (key[0] !== "_") {
                const num = parseFloat(value);
                if (value === String(num)) {
                    value = num;
                }
                break;
            }
        case "queue":
        case "promise":
        case "promiseRejectEmpty":
        case "easing":
        case "started":
            console.warn(`VelocityJS: Trying to set a read-only key:`, key);
            return;
    }
    if (value === undefined || value !== value) {
        console.warn(`VelocityJS: Trying to set an invalid value:${key}=${value} (${args[1]})`);
        return null;
    }
    for (const animation of animations) {
        if (isPercentComplete) {
            animation.timeStart = tick_1.lastTick - (utility_1.getValue(animation.duration, animation.options.duration, defaults_1.defaults.duration) * value);
        }
        else {
            animation[key] = value;
        }
    }
    if (promiseHandler) {
        if (types_1.isVelocityResult(elements) && elements.velocity.animations && elements.then) {
            elements.then(promiseHandler._resolver);
        }
        else {
            promiseHandler._resolver(elements);
        }
    }
}
actions_1.registerAction(["option", option], true);
