"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utility_1 = require("../../utility");
const complete_1 = require("../complete");
const setPropertyValue_1 = require("../css/setPropertyValue");
const defaults_1 = require("../defaults");
const options_1 = require("../options");
const state_1 = require("../state");
const tick_1 = require("../tick");
const tweens_1 = require("../tweens");
const actions_1 = require("./actions");
function checkAnimationShouldBeFinished(animation, queueName, defaultQueue) {
    tweens_1.validateTweens(animation);
    if (queueName === undefined || queueName === utility_1.getValue(animation.queue, animation.options.queue, defaultQueue)) {
        if (!(animation._flags & 4)) {
            const options = animation.options;
            if (options._started++ === 0) {
                options._first = animation;
                if (options.begin) {
                    tick_1.beginCall(animation);
                    options.begin = undefined;
                }
            }
            animation._flags |= 4;
        }
        for (const property in animation.tweens) {
            const tween = animation.tweens[property], sequence = tween.sequence, pattern = sequence.pattern;
            let currentValue = "", i = 0;
            if (pattern) {
                const endValues = sequence[sequence.length - 1];
                for (; i < pattern.length; i++) {
                    const endValue = endValues[i];
                    currentValue += endValue == null ? pattern[i] : endValue;
                }
            }
            setPropertyValue_1.setPropertyValue(animation.element, property, currentValue, tween.fn);
        }
        complete_1.completeCall(animation);
    }
}
function finish(args, elements, promiseHandler) {
    const queueName = options_1.validateQueue(args[0], true), defaultQueue = defaults_1.defaults.queue, finishAll = args[queueName === undefined ? 0 : 1] === true;
    if (types_1.isVelocityResult(elements) && elements.velocity.animations) {
        for (const animation of elements.velocity.animations) {
            checkAnimationShouldBeFinished(animation, queueName, defaultQueue);
        }
    }
    else {
        while (state_1.State.firstNew) {
            tweens_1.validateTweens(state_1.State.firstNew);
        }
        for (let activeCall = state_1.State.first, nextCall; activeCall && (finishAll || activeCall !== state_1.State.firstNew); activeCall = nextCall || state_1.State.firstNew) {
            nextCall = activeCall._next;
            if (!elements || elements.includes(activeCall.element)) {
                checkAnimationShouldBeFinished(activeCall, queueName, defaultQueue);
            }
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
actions_1.registerAction(["finish", finish], true);
