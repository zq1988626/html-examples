"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utility_1 = require("../../utility");
const defaults_1 = require("../defaults");
const options_1 = require("../options");
const state_1 = require("../state");
const actions_1 = require("./actions");
function checkAnimation(animation, queueName, defaultQueue, isPaused) {
    if (queueName === undefined || queueName === utility_1.getValue(animation.queue, animation.options.queue, defaultQueue)) {
        if (isPaused) {
            animation._flags |= 16;
        }
        else {
            animation._flags &= ~16;
        }
    }
}
function pauseResume(args, elements, promiseHandler, action) {
    const isPaused = action.indexOf("pause") === 0, queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined, queueName = queue === "false" ? false : options_1.validateQueue(args[0]), defaultQueue = defaults_1.defaults.queue;
    if (types_1.isVelocityResult(elements) && elements.velocity.animations) {
        for (const animation of elements.velocity.animations) {
            checkAnimation(animation, queueName, defaultQueue, isPaused);
        }
    }
    else {
        let activeCall = state_1.State.first;
        while (activeCall) {
            if (!elements || elements.includes(activeCall.element)) {
                checkAnimation(activeCall, queueName, defaultQueue, isPaused);
            }
            activeCall = activeCall._next;
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
actions_1.registerAction(["pause", pauseResume], true);
actions_1.registerAction(["resume", pauseResume], true);
