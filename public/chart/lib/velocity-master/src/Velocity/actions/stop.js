"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utility_1 = require("../../utility");
const complete_1 = require("../complete");
const defaults_1 = require("../defaults");
const options_1 = require("../options");
const state_1 = require("../state");
const tweens_1 = require("../tweens");
const actions_1 = require("./actions");
function checkAnimationShouldBeStopped(animation, queueName, defaultQueue) {
    tweens_1.validateTweens(animation);
    if (queueName === undefined || queueName === utility_1.getValue(animation.queue, animation.options.queue, defaultQueue)) {
        animation._flags |= 8;
        complete_1.completeCall(animation);
    }
}
function stop(args, elements, promiseHandler, action) {
    const queueName = options_1.validateQueue(args[0], true), defaultQueue = defaults_1.defaults.queue, finishAll = args[queueName === undefined ? 0 : 1] === true;
    if (types_1.isVelocityResult(elements) && elements.velocity.animations) {
        for (const animation of elements.velocity.animations) {
            checkAnimationShouldBeStopped(animation, queueName, defaultQueue);
        }
    }
    else {
        while (state_1.State.firstNew) {
            tweens_1.validateTweens(state_1.State.firstNew);
        }
        for (let activeCall = state_1.State.first, nextCall; activeCall && (finishAll || activeCall !== state_1.State.firstNew); activeCall = nextCall || state_1.State.firstNew) {
            nextCall = activeCall._next;
            if (!elements || elements.includes(activeCall.element)) {
                checkAnimationShouldBeStopped(activeCall, queueName, defaultQueue);
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
actions_1.registerAction(["stop", stop], true);
