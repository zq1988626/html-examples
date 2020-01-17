"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const utility_1 = require("./utility");
const data_1 = require("./Velocity/data");
const options_1 = require("./Velocity/options");
const queue_1 = require("./Velocity/queue");
const sequences_1 = require("./Velocity/sequences");
const tick_1 = require("./Velocity/tick");
const tweens_1 = require("./Velocity/tweens");
const actions_1 = require("./Velocity/actions/actions");
const defaults_1 = require("./Velocity/defaults");
const sequencesObject_1 = require("./Velocity/sequencesObject");
const state_1 = require("./Velocity/state");
let globalPromise;
try {
    globalPromise = Promise;
}
catch (_a) { }
const noPromiseOption = ", if that is deliberate then pass `promiseRejectEmpty:false` as an option";
function patchPromise(promiseObject, result) {
    utility_1.defineProperty(result, "promise", promiseObject);
    utility_1.defineProperty(result, "then", promiseObject.then.bind(promiseObject));
    utility_1.defineProperty(result, "catch", promiseObject.catch.bind(promiseObject));
    if (promiseObject.finally) {
        utility_1.defineProperty(result, "finally", promiseObject.finally.bind(promiseObject));
    }
}
function Velocity(...argsList) {
    const defaults = defaults_1.defaults, args = arguments, args0 = args[0], syntacticSugar = types_1.isPlainObject(args0) && (args0.p || ((types_1.isPlainObject(args0.properties) && !args0.properties.names) || types_1.isString(args0.properties)));
    let argumentIndex = 0, elements, propertiesMap, optionsMap, animations, promise, resolver, rejecter;
    if (types_1.isNode(this)) {
        elements = [this];
    }
    else if (types_1.isWrapped(this)) {
        elements = utility_1.cloneArray(this);
        if (types_1.isVelocityResult(this)) {
            animations = this.velocity.animations;
        }
    }
    else if (syntacticSugar) {
        elements = utility_1.cloneArray(args0.elements || args0.e);
        argumentIndex++;
    }
    else if (types_1.isNode(args0)) {
        elements = utility_1.cloneArray([args0]);
        argumentIndex++;
    }
    else if (types_1.isWrapped(args0)) {
        elements = utility_1.cloneArray(args0);
        argumentIndex++;
    }
    if (elements) {
        utility_1.defineProperty(elements, "velocity", Velocity.bind(elements));
        if (animations) {
            utility_1.defineProperty(elements.velocity, "animations", animations);
        }
    }
    if (syntacticSugar) {
        propertiesMap = utility_1.getValue(args0.properties, args0.p);
    }
    else {
        propertiesMap = args[argumentIndex++];
    }
    const isReverse = propertiesMap === "reverse", isAction = !isReverse && types_1.isString(propertiesMap), maybeSequence = isAction && sequencesObject_1.SequencesObject[propertiesMap], opts = syntacticSugar ? utility_1.getValue(args0.options, args0.o) : args[argumentIndex];
    if (types_1.isPlainObject(opts)) {
        optionsMap = opts;
    }
    if (globalPromise && utility_1.getValue(optionsMap && optionsMap.promise, defaults.promise)) {
        promise = new globalPromise((resolve, reject) => {
            rejecter = reject;
            resolver = (result) => {
                if (types_1.isVelocityResult(result) && result.promise) {
                    delete result.then;
                    delete result.catch;
                    delete result.finally;
                    resolve(result);
                    patchPromise(result.promise, result);
                }
                else {
                    resolve(result);
                }
            };
        });
        if (elements) {
            patchPromise(promise, elements);
        }
    }
    if (promise) {
        const optionPromiseRejectEmpty = optionsMap && optionsMap.promiseRejectEmpty, promiseRejectEmpty = utility_1.getValue(optionPromiseRejectEmpty, defaults.promiseRejectEmpty);
        if (!elements && !isAction) {
            if (promiseRejectEmpty) {
                rejecter(`Velocity: No elements supplied${types_1.isBoolean(optionPromiseRejectEmpty) ? "" : noPromiseOption}. Aborting.`);
            }
            else {
                resolver();
            }
        }
        else if (!propertiesMap) {
            if (promiseRejectEmpty) {
                rejecter(`Velocity: No properties supplied${types_1.isBoolean(optionPromiseRejectEmpty) ? "" : noPromiseOption}. Aborting.`);
            }
            else {
                resolver();
            }
        }
    }
    if ((!elements && !isAction) || !propertiesMap) {
        return promise;
    }
    if (isAction) {
        const actionArgs = [], promiseHandler = promise && {
            _promise: promise,
            _resolver: resolver,
            _rejecter: rejecter,
        };
        while (argumentIndex < args.length) {
            actionArgs.push(args[argumentIndex++]);
        }
        const action = propertiesMap.replace(/\..*$/, ""), callback = actions_1.Actions[action];
        if (callback) {
            const result = callback(actionArgs, elements, promiseHandler, propertiesMap);
            if (result !== undefined) {
                return result;
            }
            return elements || promise;
        }
        else if (!maybeSequence) {
            console.error(`VelocityJS: First argument (${propertiesMap}) was not a property map, a known action, or a registered redirect. Aborting.`);
            return;
        }
    }
    let hasValidDuration;
    if (types_1.isPlainObject(propertiesMap) || isReverse || maybeSequence) {
        const options = {};
        let isSync = defaults.sync;
        if (promise) {
            utility_1.defineProperty(options, "_promise", promise);
            utility_1.defineProperty(options, "_rejecter", rejecter);
            utility_1.defineProperty(options, "_resolver", resolver);
        }
        utility_1.defineProperty(options, "_ready", 0);
        utility_1.defineProperty(options, "_started", 0);
        utility_1.defineProperty(options, "_completed", 0);
        utility_1.defineProperty(options, "_total", 0);
        if (types_1.isPlainObject(optionsMap)) {
            const validDuration = options_1.validateDuration(optionsMap.duration);
            hasValidDuration = validDuration !== undefined;
            options.duration = utility_1.getValue(validDuration, defaults.duration);
            options.delay = utility_1.getValue(options_1.validateDelay(optionsMap.delay), defaults.delay);
            options.easing = options_1.validateEasing(utility_1.getValue(optionsMap.easing, defaults.easing), options.duration) || options_1.validateEasing(defaults.easing, options.duration);
            options.loop = utility_1.getValue(options_1.validateLoop(optionsMap.loop), defaults.loop);
            options.repeat = options.repeatAgain = utility_1.getValue(options_1.validateRepeat(optionsMap.repeat), defaults.repeat);
            if (optionsMap.speed != null) {
                options.speed = utility_1.getValue(options_1.validateSpeed(optionsMap.speed), 1);
            }
            if (types_1.isBoolean(optionsMap.promise)) {
                options.promise = optionsMap.promise;
            }
            options.queue = utility_1.getValue(options_1.validateQueue(optionsMap.queue), defaults.queue);
            if (optionsMap.mobileHA && !state_1.State.isGingerbread) {
                options.mobileHA = true;
            }
            if (optionsMap.drag === true) {
                options.drag = true;
            }
            if (types_1.isNumber(optionsMap.stagger) || types_1.isFunction(optionsMap.stagger)) {
                options.stagger = optionsMap.stagger;
            }
            if (!isReverse) {
                if (optionsMap["display"] != null) {
                    propertiesMap.display = optionsMap["display"];
                    console.error(`Deprecated "options.display" used, this is now a property:`, optionsMap["display"]);
                }
                if (optionsMap["visibility"] != null) {
                    propertiesMap.visibility = optionsMap["visibility"];
                    console.error(`Deprecated "options.visibility" used, this is now a property:`, optionsMap["visibility"]);
                }
            }
            const optionsBegin = options_1.validateBegin(optionsMap.begin), optionsComplete = options_1.validateComplete(optionsMap.complete), optionsProgress = options_1.validateProgress(optionsMap.progress), optionsSync = options_1.validateSync(optionsMap.sync);
            if (optionsBegin != null) {
                options.begin = optionsBegin;
            }
            if (optionsComplete != null) {
                options.complete = optionsComplete;
            }
            if (optionsProgress != null) {
                options.progress = optionsProgress;
            }
            if (optionsSync != null) {
                isSync = optionsSync;
            }
        }
        else if (!syntacticSugar) {
            let offset = 0;
            options.duration = options_1.validateDuration(args[argumentIndex], true);
            if (options.duration === undefined) {
                options.duration = defaults.duration;
            }
            else {
                hasValidDuration = true;
                offset++;
            }
            if (!types_1.isFunction(args[argumentIndex + offset])) {
                const easing = options_1.validateEasing(args[argumentIndex + offset], utility_1.getValue(options && options_1.validateDuration(options.duration), defaults.duration), true);
                if (easing !== undefined) {
                    offset++;
                    options.easing = easing;
                }
            }
            const complete = options_1.validateComplete(args[argumentIndex + offset], true);
            if (complete !== undefined) {
                options.complete = complete;
            }
            options.delay = defaults.delay;
            options.loop = defaults.loop;
            options.repeat = options.repeatAgain = defaults.repeat;
        }
        if (isReverse && options.queue === false) {
            throw new Error("VelocityJS: Cannot reverse a queue:false animation.");
        }
        if (!hasValidDuration && maybeSequence && maybeSequence.duration) {
            options.duration = maybeSequence.duration;
        }
        const rootAnimation = {
            options,
            elements,
            _prev: undefined,
            _next: undefined,
            _flags: isSync ? 32 : 0,
            percentComplete: 0,
            ellapsedTime: 0,
            timeStart: 0,
        };
        animations = [];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            let flags = 0;
            if (types_1.isNode(element)) {
                if (isReverse) {
                    const lastAnimation = data_1.Data(element).lastAnimationList[options.queue];
                    propertiesMap = lastAnimation && lastAnimation.tweens;
                    if (!propertiesMap) {
                        console.error(`VelocityJS: Attempting to reverse an animation on an element with no previous animation:`, element);
                        continue;
                    }
                    flags |= 64 & ~(lastAnimation._flags & 64);
                }
                const animation = Object.assign({}, rootAnimation, { element, _flags: rootAnimation._flags | flags });
                options._total++;
                animations.push(animation);
                if (options.stagger) {
                    if (types_1.isFunction(options.stagger)) {
                        const num = optionCallback(options.stagger, element, index, elements.length, elements, "stagger");
                        if (types_1.isNumber(num)) {
                            animation.delay = options.delay + num;
                        }
                    }
                    else {
                        animation.delay = options.delay + (options.stagger * index);
                    }
                }
                if (options.drag) {
                    animation.duration = options.duration - (options.duration * Math.max(1 - (index + 1) / elements.length, 0.75));
                }
                if (maybeSequence) {
                    sequences_1.expandSequence(animation, maybeSequence);
                }
                else if (isReverse) {
                    animation.tweens = propertiesMap;
                }
                else {
                    animation.tweens = Object.create(null);
                    tweens_1.expandProperties(animation, propertiesMap);
                }
                queue_1.queue(element, animation, options.queue);
            }
        }
        if (state_1.State.isTicking === false) {
            tick_1.tick(false);
        }
        if (animations) {
            utility_1.defineProperty(elements.velocity, "animations", animations);
        }
    }
    return elements || promise;
}
exports.Velocity = Velocity;
function optionCallback(fn, element, index, length, elements, option) {
    try {
        return fn.call(element, index, length, elements, option);
    }
    catch (e) {
        console.error(`VelocityJS: Exception when calling '${option}' callback:`, e);
    }
}
