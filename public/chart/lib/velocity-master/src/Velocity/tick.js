"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../utility");
const velocity_1 = require("../velocity");
const complete_1 = require("./complete");
const removeNestedCalc_1 = require("./css/removeNestedCalc");
const setPropertyValue_1 = require("./css/setPropertyValue");
const data_1 = require("./data");
const defaults_1 = require("./defaults");
const easings_1 = require("./easing/easings");
const queue_1 = require("./queue");
const state_1 = require("./state");
const tweens_1 = require("./tweens");
function beginCall(activeCall) {
    const callback = activeCall.begin || activeCall.options.begin;
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
exports.beginCall = beginCall;
function progressCall(activeCall) {
    const callback = activeCall.progress || activeCall.options.progress;
    if (callback) {
        try {
            const elements = activeCall.elements, percentComplete = activeCall.percentComplete, options = activeCall.options, tweenValue = activeCall.tween;
            callback.call(elements, elements, percentComplete, Math.max(0, activeCall.timeStart + (activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaults_1.defaults.duration) - exports.lastTick), tweenValue !== undefined ? tweenValue : String(percentComplete * 100), activeCall);
        }
        catch (error) {
            setTimeout(() => {
                throw error;
            }, 1);
        }
    }
}
function asyncCallbacks() {
    for (const activeCall of progressed) {
        progressCall(activeCall);
    }
    progressed.clear();
    for (const activeCall of completed) {
        complete_1.completeCall(activeCall);
    }
    completed.clear();
}
const FRAME_TIME = 1000 / 60, completed = new Set(), progressed = new Set(), performance = (() => {
    const perf = window.performance || {};
    if (typeof perf.now !== "function") {
        const nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : utility_1.now();
        perf.now = () => {
            return utility_1.now() - nowOffset;
        };
    }
    return perf;
})(), rAFProxy = (callback) => {
    return setTimeout(callback, Math.max(0, FRAME_TIME - (performance.now() - exports.lastTick)));
}, rAFShim = window.requestAnimationFrame || rAFProxy;
let ticking, worker;
exports.lastTick = 0;
function workerFn() {
    let interval;
    this.onmessage = (e) => {
        switch (e.data) {
            case true:
                if (!interval) {
                    interval = setInterval(() => {
                        this.postMessage(true);
                    }, 1000 / 30);
                }
                break;
            case false:
                if (interval) {
                    clearInterval(interval);
                    interval = 0;
                }
                break;
            default:
                this.postMessage(e.data);
                break;
        }
    };
}
try {
    worker = new Worker(URL.createObjectURL(new Blob([`(${workerFn})()`])));
    worker.onmessage = (e) => {
        if (e.data === true) {
            tick();
        }
        else {
            asyncCallbacks();
        }
    };
    if (!state_1.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", () => {
            worker.postMessage(state_1.State.isTicking && document.hidden);
        });
    }
}
catch (e) {
}
function tick(timestamp) {
    if (ticking) {
        return;
    }
    ticking = true;
    if (timestamp !== false) {
        const timeCurrent = performance.now(), deltaTime = exports.lastTick ? timeCurrent - exports.lastTick : FRAME_TIME, defaultSpeed = defaults_1.defaults.speed, defaultEasing = defaults_1.defaults.easing, defaultDuration = defaults_1.defaults.duration;
        let activeCall, nextCall;
        if (deltaTime >= defaults_1.defaults.minFrameTime || !exports.lastTick) {
            exports.lastTick = timeCurrent;
            while (state_1.State.firstNew) {
                tweens_1.validateTweens(state_1.State.firstNew);
            }
            for (activeCall = state_1.State.first; activeCall && activeCall !== state_1.State.firstNew; activeCall = activeCall._next) {
                const element = activeCall.element, data = data_1.Data(element);
                if (!element.parentNode || !data) {
                    queue_1.freeAnimationCall(activeCall);
                    continue;
                }
                const options = activeCall.options, flags = activeCall._flags;
                let timeStart = activeCall.timeStart;
                if (!timeStart) {
                    const queue = activeCall.queue != null ? activeCall.queue : options.queue;
                    timeStart = timeCurrent - deltaTime;
                    if (queue !== false) {
                        timeStart = Math.max(timeStart, data.lastFinishList[queue] || 0);
                    }
                    activeCall.timeStart = timeStart;
                }
                if (flags & 16) {
                    activeCall.timeStart += deltaTime;
                    continue;
                }
                if (!(flags & 2)) {
                    activeCall._flags |= 2;
                    options._ready++;
                }
            }
            for (activeCall = state_1.State.first; activeCall && activeCall !== state_1.State.firstNew; activeCall = nextCall) {
                const flags = activeCall._flags;
                nextCall = activeCall._next;
                if (!(flags & 2) || (flags & 16)) {
                    continue;
                }
                const options = activeCall.options;
                if ((flags & 32) && options._ready < options._total) {
                    activeCall.timeStart += deltaTime;
                    continue;
                }
                const speed = activeCall.speed != null ? activeCall.speed : options.speed != null ? options.speed : defaultSpeed;
                let timeStart = activeCall.timeStart;
                if (!(flags & 4)) {
                    const delay = activeCall.delay != null ? activeCall.delay : options.delay;
                    if (delay) {
                        if (timeStart + (delay / speed) > timeCurrent) {
                            continue;
                        }
                        activeCall.timeStart = timeStart += delay / (delay > 0 ? speed : 1);
                    }
                    activeCall._flags |= 4;
                    if (options._started++ === 0) {
                        options._first = activeCall;
                        if (options.begin) {
                            beginCall(activeCall);
                            options.begin = undefined;
                        }
                    }
                }
                if (speed !== 1) {
                    activeCall.timeStart = timeStart += Math.min(deltaTime, timeCurrent - timeStart) * (1 - speed);
                }
                const activeEasing = activeCall.easing != null ? activeCall.easing : options.easing != null ? options.easing : defaultEasing, millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart, duration = activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaultDuration, percentComplete = activeCall.percentComplete = velocity_1.default.mock ? 1 : Math.min(millisecondsEllapsed / duration, 1), tweens = activeCall.tweens, reverse = flags & 64;
                if (activeCall.progress || (options._first === activeCall && options.progress)) {
                    progressed.add(activeCall);
                }
                if (percentComplete === 1) {
                    completed.add(activeCall);
                }
                for (const property in tweens) {
                    const tween = tweens[property], sequence = tween.sequence, pattern = sequence.pattern;
                    let currentValue = "", i = 0;
                    if (pattern) {
                        const easingComplete = (tween.easing || activeEasing)(percentComplete, 0, 1, property);
                        let best = 0;
                        for (let j = 0; j < sequence.length - 1; j++) {
                            if (sequence[j].percent < easingComplete) {
                                best = j;
                            }
                        }
                        const tweenFrom = sequence[best], tweenTo = sequence[best + 1] || tweenFrom, rawPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent), tweenPercent = reverse ? 1 - rawPercent : rawPercent, easing = tweenTo.easing || activeEasing || easings_1.linearEasing;
                        for (; i < pattern.length; i++) {
                            const startValue = tweenFrom[i];
                            if (startValue == null) {
                                currentValue += pattern[i];
                            }
                            else {
                                const endValue = tweenTo[i];
                                if (startValue === endValue) {
                                    currentValue += startValue;
                                }
                                else {
                                    const result = easing(tweenPercent, startValue, endValue, property);
                                    currentValue += pattern[i] !== true ? result : Math.round(result);
                                }
                            }
                        }
                        if (property !== "tween") {
                            if (percentComplete === 1) {
                                currentValue = removeNestedCalc_1.removeNestedCalc(currentValue);
                            }
                            setPropertyValue_1.setPropertyValue(activeCall.element, property, currentValue, tween.fn);
                        }
                        else {
                            activeCall.tween = currentValue;
                        }
                    }
                    else {
                        console.warn(`VelocityJS: Missing pattern:`, property, JSON.stringify(tween[property]));
                        delete tweens[property];
                    }
                }
            }
            if (progressed.size || completed.size) {
                if (!document.hidden) {
                    asyncCallbacks();
                }
                else if (worker) {
                    worker.postMessage("");
                }
                else {
                    setTimeout(asyncCallbacks, 1);
                }
            }
        }
    }
    if (state_1.State.first) {
        state_1.State.isTicking = true;
        if (!document.hidden) {
            rAFShim(tick);
        }
        else if (!worker) {
            rAFProxy(tick);
        }
        else if (timestamp === false) {
            worker.postMessage(true);
        }
    }
    else {
        state_1.State.isTicking = false;
        exports.lastTick = 0;
        if (document.hidden && worker) {
            worker.postMessage(false);
        }
    }
    ticking = false;
}
exports.tick = tick;
