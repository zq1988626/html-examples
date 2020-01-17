"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../utility");
const data_1 = require("./data");
const defaults_1 = require("./defaults");
const queue_1 = require("./queue");
const state_1 = require("./state");
function callComplete(activeCall) {
    const callback = activeCall.complete || activeCall.options.complete;
    if (callback) {
        try {
            const elements = activeCall.elements;
            callback.call(elements, elements, activeCall);
        }
        catch (error) {
            setTimeout(() => {
                throw error;
            }, 1);
        }
    }
}
function completeCall(activeCall) {
    const options = activeCall.options, queue = utility_1.getValue(activeCall.queue, options.queue), isLoop = utility_1.getValue(activeCall.loop, options.loop, defaults_1.defaults.loop), isRepeat = utility_1.getValue(activeCall.repeat, options.repeat, defaults_1.defaults.repeat), isStopped = activeCall._flags & 8;
    if (!isStopped && (isLoop || isRepeat)) {
        if (isRepeat && isRepeat !== true) {
            activeCall.repeat = isRepeat - 1;
        }
        else if (isLoop && isLoop !== true) {
            activeCall.loop = isLoop - 1;
            activeCall.repeat = utility_1.getValue(activeCall.repeatAgain, options.repeatAgain, defaults_1.defaults.repeatAgain);
        }
        if (isLoop) {
            activeCall._flags ^= 64;
        }
        if (queue !== false) {
            data_1.Data(activeCall.element).lastFinishList[queue] = activeCall.timeStart + utility_1.getValue(activeCall.duration, options.duration, defaults_1.defaults.duration);
        }
        activeCall.timeStart = activeCall.ellapsedTime = activeCall.percentComplete = 0;
        activeCall._flags &= ~4;
    }
    else {
        const element = activeCall.element, data = data_1.Data(element);
        if (!--data.count && !isStopped) {
            utility_1.removeClass(element, state_1.State.className);
        }
        if (options && ++options._completed === options._total) {
            if (!isStopped && options.complete) {
                callComplete(activeCall);
                options.complete = null;
            }
            const resolver = options._resolver;
            if (resolver) {
                resolver(activeCall.elements);
                delete options._resolver;
            }
        }
        if (queue !== false) {
            if (!isStopped) {
                data.lastFinishList[queue] = activeCall.timeStart + utility_1.getValue(activeCall.duration, options.duration, defaults_1.defaults.duration);
            }
            queue_1.dequeue(element, queue);
        }
        queue_1.freeAnimationCall(activeCall);
    }
}
exports.completeCall = completeCall;
