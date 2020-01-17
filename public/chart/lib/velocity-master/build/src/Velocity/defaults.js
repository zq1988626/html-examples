/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */
// Project
import { isBoolean } from "../types";
import { validateBegin, validateCache, validateComplete, validateDelay, validateDuration, validateEasing, validateFpsLimit, validateLoop, validatePromise, validatePromiseRejectEmpty, validateQueue, validateRepeat, validateSpeed, validateSync, } from "./options";
// Constants
import { DEFAULT_CACHE, DEFAULT_DELAY, DEFAULT_DURATION, DEFAULT_EASING, DEFAULT_FPSLIMIT, DEFAULT_LOOP, DEFAULT_PROMISE, DEFAULT_PROMISE_REJECT_EMPTY, DEFAULT_QUEUE, DEFAULT_REPEAT, DEFAULT_SPEED, DEFAULT_SYNC, FUZZY_MS_PER_SECOND, } from "../constants";
// NOTE: Add the variable here, then add the default state in "reset" below.
let cache, begin, complete, delay, duration, easing, fpsLimit, loop, mobileHA, minFrameTime, promise, promiseRejectEmpty, queue, repeat, speed, sync;
export class defaults {
    static reset() {
        cache = DEFAULT_CACHE;
        begin = undefined;
        complete = undefined;
        delay = DEFAULT_DELAY;
        duration = DEFAULT_DURATION;
        easing = validateEasing(DEFAULT_EASING, DEFAULT_DURATION);
        fpsLimit = DEFAULT_FPSLIMIT;
        loop = DEFAULT_LOOP;
        minFrameTime = FUZZY_MS_PER_SECOND / DEFAULT_FPSLIMIT;
        promise = DEFAULT_PROMISE;
        promiseRejectEmpty = DEFAULT_PROMISE_REJECT_EMPTY;
        queue = DEFAULT_QUEUE;
        repeat = DEFAULT_REPEAT;
        speed = DEFAULT_SPEED;
        sync = DEFAULT_SYNC;
    }
    static get cache() {
        return cache;
    }
    static set cache(value) {
        value = validateCache(value);
        if (value !== undefined) {
            cache = value;
        }
    }
    static get begin() {
        return begin;
    }
    static set begin(value) {
        value = validateBegin(value);
        if (value !== undefined) {
            begin = value;
        }
    }
    static get complete() {
        return complete;
    }
    static set complete(value) {
        value = validateComplete(value);
        if (value !== undefined) {
            complete = value;
        }
    }
    static get delay() {
        return delay;
    }
    static set delay(value) {
        value = validateDelay(value);
        if (value !== undefined) {
            delay = value;
        }
    }
    static get duration() {
        return duration;
    }
    static set duration(value) {
        value = validateDuration(value);
        if (value !== undefined) {
            duration = value;
        }
    }
    static get easing() {
        return easing;
    }
    static set easing(value) {
        value = validateEasing(value, duration);
        if (value !== undefined) {
            easing = value;
        }
    }
    static get fpsLimit() {
        return fpsLimit;
    }
    static set fpsLimit(value) {
        value = validateFpsLimit(value);
        if (value !== undefined) {
            fpsLimit = value;
            minFrameTime = FUZZY_MS_PER_SECOND / value;
        }
    }
    static get loop() {
        return loop;
    }
    static set loop(value) {
        value = validateLoop(value);
        if (value !== undefined) {
            loop = value;
        }
    }
    static get mobileHA() {
        return mobileHA;
    }
    static set mobileHA(value) {
        if (isBoolean(value)) {
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
        value = validatePromise(value);
        if (value !== undefined) {
            promise = value;
        }
    }
    static get promiseRejectEmpty() {
        return promiseRejectEmpty;
    }
    static set promiseRejectEmpty(value) {
        value = validatePromiseRejectEmpty(value);
        if (value !== undefined) {
            promiseRejectEmpty = value;
        }
    }
    static get queue() {
        return queue;
    }
    static set queue(value) {
        value = validateQueue(value);
        if (value !== undefined) {
            queue = value;
        }
    }
    static get repeat() {
        return repeat;
    }
    static set repeat(value) {
        value = validateRepeat(value);
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
        value = validateSpeed(value);
        if (value !== undefined) {
            speed = value;
        }
    }
    static get sync() {
        return sync;
    }
    static set sync(value) {
        value = validateSync(value);
        if (value !== undefined) {
            sync = value;
        }
    }
}
Object.freeze(defaults);
// Reset to our default values, currently everything is undefined.
defaults.reset();
//# sourceMappingURL=defaults.js.map