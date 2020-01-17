"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const options_1 = require("./options");
const constants_1 = require("../constants");
let cache, begin, complete, delay, duration, easing, fpsLimit, loop, mobileHA, minFrameTime, promise, promiseRejectEmpty, queue, repeat, speed, sync;
class defaults {
    static reset() {
        cache = constants_1.DEFAULT_CACHE;
        begin = undefined;
        complete = undefined;
        delay = constants_1.DEFAULT_DELAY;
        duration = constants_1.DEFAULT_DURATION;
        easing = options_1.validateEasing(constants_1.DEFAULT_EASING, constants_1.DEFAULT_DURATION);
        fpsLimit = constants_1.DEFAULT_FPSLIMIT;
        loop = constants_1.DEFAULT_LOOP;
        minFrameTime = constants_1.FUZZY_MS_PER_SECOND / constants_1.DEFAULT_FPSLIMIT;
        promise = constants_1.DEFAULT_PROMISE;
        promiseRejectEmpty = constants_1.DEFAULT_PROMISE_REJECT_EMPTY;
        queue = constants_1.DEFAULT_QUEUE;
        repeat = constants_1.DEFAULT_REPEAT;
        speed = constants_1.DEFAULT_SPEED;
        sync = constants_1.DEFAULT_SYNC;
    }
    static get cache() {
        return cache;
    }
    static set cache(value) {
        value = options_1.validateCache(value);
        if (value !== undefined) {
            cache = value;
        }
    }
    static get begin() {
        return begin;
    }
    static set begin(value) {
        value = options_1.validateBegin(value);
        if (value !== undefined) {
            begin = value;
        }
    }
    static get complete() {
        return complete;
    }
    static set complete(value) {
        value = options_1.validateComplete(value);
        if (value !== undefined) {
            complete = value;
        }
    }
    static get delay() {
        return delay;
    }
    static set delay(value) {
        value = options_1.validateDelay(value);
        if (value !== undefined) {
            delay = value;
        }
    }
    static get duration() {
        return duration;
    }
    static set duration(value) {
        value = options_1.validateDuration(value);
        if (value !== undefined) {
            duration = value;
        }
    }
    static get easing() {
        return easing;
    }
    static set easing(value) {
        value = options_1.validateEasing(value, duration);
        if (value !== undefined) {
            easing = value;
        }
    }
    static get fpsLimit() {
        return fpsLimit;
    }
    static set fpsLimit(value) {
        value = options_1.validateFpsLimit(value);
        if (value !== undefined) {
            fpsLimit = value;
            minFrameTime = constants_1.FUZZY_MS_PER_SECOND / value;
        }
    }
    static get loop() {
        return loop;
    }
    static set loop(value) {
        value = options_1.validateLoop(value);
        if (value !== undefined) {
            loop = value;
        }
    }
    static get mobileHA() {
        return mobileHA;
    }
    static set mobileHA(value) {
        if (types_1.isBoolean(value)) {
            mobileHA = value;
        }
    }
    static get minFrameTime() {
        return minFrameTime;
    }
    static get promise() {
        return promise;
    }
    static set promise(value) {
        value = options_1.validatePromise(value);
        if (value !== undefined) {
            promise = value;
        }
    }
    static get promiseRejectEmpty() {
        return promiseRejectEmpty;
    }
    static set promiseRejectEmpty(value) {
        value = options_1.validatePromiseRejectEmpty(value);
        if (value !== undefined) {
            promiseRejectEmpty = value;
        }
    }
    static get queue() {
        return queue;
    }
    static set queue(value) {
        value = options_1.validateQueue(value);
        if (value !== undefined) {
            queue = value;
        }
    }
    static get repeat() {
        return repeat;
    }
    static set repeat(value) {
        value = options_1.validateRepeat(value);
        if (value !== undefined) {
            repeat = value;
        }
    }
    static get repeatAgain() {
        return repeat;
    }
    static get speed() {
        return speed;
    }
    static set speed(value) {
        value = options_1.validateSpeed(value);
        if (value !== undefined) {
            speed = value;
        }
    }
    static get sync() {
        return sync;
    }
    static set sync(value) {
        value = options_1.validateSync(value);
        if (value !== undefined) {
            sync = value;
        }
    }
}
exports.defaults = defaults;
Object.freeze(defaults);
defaults.reset();
