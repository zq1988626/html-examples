"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const utility_1 = require("../utility");
const data_1 = require("./data");
const state_1 = require("./state");
function animate(animation) {
    const prev = state_1.State.last;
    animation._prev = prev;
    animation._next = undefined;
    if (prev) {
        prev._next = animation;
    }
    else {
        state_1.State.first = animation;
    }
    state_1.State.last = animation;
    if (!state_1.State.firstNew) {
        state_1.State.firstNew = animation;
    }
    const element = animation.element, data = data_1.Data(element);
    if (!data.count++) {
        utility_1.addClass(element, state_1.State.className);
    }
}
function queue(element, animation, queueName) {
    const data = data_1.Data(element);
    if (queueName !== false) {
        data.lastAnimationList[queueName] = animation;
    }
    if (queueName === false) {
        animate(animation);
    }
    else {
        if (!types_1.isString(queueName)) {
            queueName = "";
        }
        let last = data.queueList[queueName];
        if (!last) {
            if (last === null) {
                data.queueList[queueName] = animation;
            }
            else {
                data.queueList[queueName] = null;
                animate(animation);
            }
        }
        else {
            while (last._next) {
                last = last._next;
            }
            last._next = animation;
            animation._prev = last;
        }
    }
}
exports.queue = queue;
function dequeue(element, queueName, skip) {
    if (queueName !== false) {
        if (!types_1.isString(queueName)) {
            queueName = "";
        }
        const data = data_1.Data(element), animation = data.queueList[queueName];
        if (animation) {
            data.queueList[queueName] = animation._next || null;
            if (!skip) {
                animate(animation);
            }
        }
        else if (animation === null) {
            delete data.queueList[queueName];
        }
        return animation;
    }
}
exports.dequeue = dequeue;
function freeAnimationCall(animation) {
    const next = animation._next, prev = animation._prev, queueName = animation.queue == null ? animation.options.queue : animation.queue;
    if (state_1.State.firstNew === animation) {
        state_1.State.firstNew = next;
    }
    if (state_1.State.first === animation) {
        state_1.State.first = next;
    }
    else if (prev) {
        prev._next = next;
    }
    if (state_1.State.last === animation) {
        state_1.State.last = prev;
    }
    else if (next) {
        next._prev = prev;
    }
    if (queueName) {
        const data = data_1.Data(animation.element);
        if (data) {
            animation._next = animation._prev = undefined;
        }
    }
}
exports.freeAnimationCall = freeAnimationCall;
