/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Core "Velocity" function.
 */
// Project
import { isBoolean, isFunction, isNode, isNumber, isPlainObject, isString, isVelocityResult, isWrapped } from "./types";
import { cloneArray, defineProperty, getValue } from "./utility";
import { Data } from "./Velocity/data";
import { validateBegin, validateComplete, validateDelay, validateDuration, validateEasing, validateLoop, validateProgress, validateQueue, validateRepeat, validateSpeed, validateSync, } from "./Velocity/options";
import { queue } from "./Velocity/queue";
import { expandSequence } from "./Velocity/sequences";
import { tick } from "./Velocity/tick";
import { expandProperties } from "./Velocity/tweens";
import { Actions as ActionsObject } from "./Velocity/actions/actions";
import { defaults as DefaultObject } from "./Velocity/defaults";
import { SequencesObject } from "./Velocity/sequencesObject";
import { State as StateObject } from "./Velocity/state";
let globalPromise;
try {
    globalPromise = Promise;
}
catch ( /**/_a) { /**/ }
const noPromiseOption = ", if that is deliberate then pass `promiseRejectEmpty:false` as an option";
/**
 * Patch a VelocityResult with a Promise.
 */
function patchPromise(promiseObject, result) {
    defineProperty(result, "promise", promiseObject);
    defineProperty(result, "then", promiseObject.then.bind(promiseObject));
    defineProperty(result, "catch", promiseObject.catch.bind(promiseObject));
    if (promiseObject.finally) {
        // Semi-standard
        defineProperty(result, "finally", promiseObject.finally.bind(promiseObject));
    }
}
/* tslint:enable:max-line-length */
export function Velocity(...argsList) {
    const 
    /**
     * A shortcut to the default options.
     */
    defaults = DefaultObject, 
    /**
     * Shortcut to arguments for file size.
     */
    args = arguments, 
    /**
     * Cache of the first argument - this is used often enough to be saved.
     */
    args0 = args[0], 
    /**
     * To allow for expressive CoffeeScript code, Velocity supports an
     * alternative syntax in which "elements" (or "e"), "properties" (or
     * "p"), and "options" (or "o") objects are defined on a container
     * object that's passed in as Velocity's sole argument.
     *
     * Note: Some browsers automatically populate arguments with a
     * "properties" object. We detect it by checking for its default
     * "names" property.
     */
    // TODO: Confirm which browsers - if <=IE8 the we can drop completely
    syntacticSugar = isPlainObject(args0) && (args0.p || ((isPlainObject(args0.properties) && !args0.properties.names) || isString(args0.properties)));
    let 
    /**
     *  When Velocity is called via the utility function (Velocity()),
     * elements are explicitly passed in as the first parameter. Thus,
     * argument positioning varies.
     */
    argumentIndex = 0, 
    /**
     * The list of elements, extended with Promise and Velocity.
     */
    elements, 
    /**
     * The properties being animated. This can be a string, in which case it
     * is either a function for these elements, or it is a "named" animation
     * sequence to use instead. Named sequences start with either "callout."
     * or "transition.". When used as a callout the values will be reset
     * after finishing. When used as a transtition then there is no special
     * handling after finishing.
     */
    propertiesMap, 
    /**
     * Options supplied, this will be mapped and validated into
     * <code>options</code>.
     */
    optionsMap, 
    /**
     * If called via a chain then this contains the <b>last</b> calls
     * animations. If this does not have a value then any access to the
     * element's animations needs to be to the currently-running ones.
     */
    animations, 
    /**
     * The promise that is returned.
     */
    promise, 
    // Used when the animation is finished
    resolver, 
    // Used when there was an issue with one or more of the Velocity arguments
    rejecter;
    //console.log(`Velocity`, _arguments)
    // First get the elements, and the animations connected to the last call if
    // this is chained.
    // TODO: Clean this up a bit
    // TODO: Throw error if the chain is called with elements as the first argument. isVelocityResult(this) && ( (isNode(arg0) || isWrapped(arg0)) && arg0 == this)
    if (isNode(this)) {
        // This is from a chain such as document.getElementById("").velocity(...)
        elements = [this];
    }
    else if (isWrapped(this)) {
        // This might be a chain from something else, but if chained from a
        // previous Velocity() call then grab the animations it's related to.
        elements = cloneArray(this);
        if (isVelocityResult(this)) {
            animations = this.velocity.animations;
        }
    }
    else if (syntacticSugar) {
        elements = cloneArray(args0.elements || args0.e);
        argumentIndex++;
    }
    else if (isNode(args0)) {
        elements = cloneArray([args0]);
        argumentIndex++;
    }
    else if (isWrapped(args0)) {
        elements = cloneArray(args0);
        argumentIndex++;
    }
    // Allow elements to be chained.
    if (elements) {
        defineProperty(elements, "velocity", Velocity.bind(elements));
        if (animations) {
            defineProperty(elements.velocity, "animations", animations);
        }
    }
    // Next get the propertiesMap and options.
    if (syntacticSugar) {
        propertiesMap = getValue(args0.properties, args0.p);
    }
    else {
        // TODO: Should be possible to call Velocity("pauseAll") - currently not possible
        propertiesMap = args[argumentIndex++];
    }
    // Get any options map passed in as arguments first, expand any direct
    // options if possible.
    const isReverse = propertiesMap === "reverse", isAction = !isReverse && isString(propertiesMap), maybeSequence = isAction && SequencesObject[propertiesMap], opts = syntacticSugar ? getValue(args0.options, args0.o) : args[argumentIndex];
    if (isPlainObject(opts)) {
        optionsMap = opts;
    }
    // Create the promise if supported and wanted.
    if (globalPromise && getValue(optionsMap && optionsMap.promise, defaults.promise)) {
        promise = new globalPromise((resolve, reject) => {
            rejecter = reject;
            // IMPORTANT:
            // If a resolver tries to run on a Promise then it will wait until
            // that Promise resolves - but in this case we're running on our own
            // Promise, so need to make sure it's not seen as one. Removing
            // these values for the duration of the resolve.
            // Due to being an async call, they should be back to "normal"
            // before the <code>.then()</code> function gets called.
            resolver = (result) => {
                if (isVelocityResult(result) && result.promise) {
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
        const optionPromiseRejectEmpty = optionsMap && optionsMap.promiseRejectEmpty, promiseRejectEmpty = getValue(optionPromiseRejectEmpty, defaults.promiseRejectEmpty);
        if (!elements && !isAction) {
            if (promiseRejectEmpty) {
                rejecter(`Velocity: No elements supplied${isBoolean(optionPromiseRejectEmpty) ? "" : noPromiseOption}. Aborting.`);
            }
            else {
                resolver();
            }
        }
        else if (!propertiesMap) {
            if (promiseRejectEmpty) {
                rejecter(`Velocity: No properties supplied${isBoolean(optionPromiseRejectEmpty) ? "" : noPromiseOption}. Aborting.`);
            }
            else {
                resolver();
            }
        }
    }
    if ((!elements && !isAction) || !propertiesMap) {
        return promise;
    }
    // NOTE: Can't use isAction here due to type inference - there are callbacks
    // between so the type isn't considered safe.
    if (isAction) {
        const actionArgs = [], promiseHandler = promise && {
            _promise: promise,
            _resolver: resolver,
            _rejecter: rejecter,
        };
        while (argumentIndex < args.length) {
            actionArgs.push(args[argumentIndex++]);
        }
        // Velocity's behavior is categorized into "actions". If a string is
        // passed in instead of a propertiesMap then that will call a function
        // to do something special to the animation linked.
        // There is one special case - "reverse" - which is handled differently,
        // by being stored on the animation and then expanded when the animation
        // starts.
        const action = propertiesMap.replace(/\..*$/, ""), callback = ActionsObject[action];
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
    if (isPlainObject(propertiesMap) || isReverse || maybeSequence) {
        /**
         * The options for this set of animations.
         */
        const options = {};
        let isSync = defaults.sync;
        // Private options first - set as non-enumerable, and starting with an
        // underscore so we can filter them out.
        if (promise) {
            defineProperty(options, "_promise", promise);
            defineProperty(options, "_rejecter", rejecter);
            defineProperty(options, "_resolver", resolver);
        }
        defineProperty(options, "_ready", 0);
        defineProperty(options, "_started", 0);
        defineProperty(options, "_completed", 0);
        defineProperty(options, "_total", 0);
        // Now check the optionsMap
        if (isPlainObject(optionsMap)) {
            const validDuration = validateDuration(optionsMap.duration);
            hasValidDuration = validDuration !== undefined;
            options.duration = getValue(validDuration, defaults.duration);
            options.delay = getValue(validateDelay(optionsMap.delay), defaults.delay);
            // Need the extra fallback here in case it supplies an invalid
            // easing that we need to overrride with the default.
            options.easing = validateEasing(getValue(optionsMap.easing, defaults.easing), options.duration) || validateEasing(defaults.easing, options.duration);
            options.loop = getValue(validateLoop(optionsMap.loop), defaults.loop);
            options.repeat = options.repeatAgain = getValue(validateRepeat(optionsMap.repeat), defaults.repeat);
            if (optionsMap.speed != null) {
                options.speed = getValue(validateSpeed(optionsMap.speed), 1);
            }
            if (isBoolean(optionsMap.promise)) {
                options.promise = optionsMap.promise;
            }
            options.queue = getValue(validateQueue(optionsMap.queue), defaults.queue);
            if (optionsMap.mobileHA && !StateObject.isGingerbread) {
                /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
                 on animating elements. HA is removed from the element at the completion of its animation. */
                /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
                /* Note: You can read more about the use of mobileHA in Velocity's documentation: velocity-animate/#mobileHA. */
                options.mobileHA = true;
            }
            if (optionsMap.drag === true) {
                options.drag = true;
            }
            if (isNumber(optionsMap.stagger) || isFunction(optionsMap.stagger)) {
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
            // TODO: Allow functional options for different options per element
            const optionsBegin = validateBegin(optionsMap.begin), optionsComplete = validateComplete(optionsMap.complete), optionsProgress = validateProgress(optionsMap.progress), optionsSync = validateSync(optionsMap.sync);
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
            // Expand any direct options if possible.
            let offset = 0;
            options.duration = validateDuration(args[argumentIndex], true);
            if (options.duration === undefined) {
                options.duration = defaults.duration;
            }
            else {
                hasValidDuration = true;
                offset++;
            }
            if (!isFunction(args[argumentIndex + offset])) {
                // Despite coming before Complete, we can't pass a fn easing
                const easing = validateEasing(args[argumentIndex + offset], getValue(options && validateDuration(options.duration), defaults.duration), true);
                if (easing !== undefined) {
                    offset++;
                    options.easing = easing;
                }
            }
            const complete = validateComplete(args[argumentIndex + offset], true);
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
        // When a set of elements is targeted by a Velocity call, the set is
        // broken up and each element has the current Velocity call individually
        // queued onto it. In this way, each element's existing queue is
        // respected; some elements may already be animating and accordingly
        // should not have this current Velocity call triggered immediately
        // unless the sync:true option is used.
        const rootAnimation = {
            options,
            elements,
            _prev: undefined,
            _next: undefined,
            _flags: isSync ? 32 /* SYNC */ : 0,
            percentComplete: 0,
            ellapsedTime: 0,
            timeStart: 0,
        };
        animations = [];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            let flags = 0;
            if (isNode(element)) { // TODO: This needs to check for valid animation targets, not just Elements
                if (isReverse) {
                    const lastAnimation = Data(element).lastAnimationList[options.queue];
                    propertiesMap = lastAnimation && lastAnimation.tweens;
                    if (!propertiesMap) {
                        console.error(`VelocityJS: Attempting to reverse an animation on an element with no previous animation:`, element);
                        continue;
                    }
                    flags |= 64 /* REVERSE */ & ~(lastAnimation._flags & 64 /* REVERSE */); // tslint:disable-line:no-bitwise
                }
                const animation = Object.assign({}, rootAnimation, { element, _flags: rootAnimation._flags | flags });
                options._total++;
                animations.push(animation);
                if (options.stagger) {
                    if (isFunction(options.stagger)) {
                        const num = optionCallback(options.stagger, element, index, elements.length, elements, "stagger");
                        if (isNumber(num)) {
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
                    expandSequence(animation, maybeSequence);
                }
                else if (isReverse) {
                    // In this case we're using the previous animation, so
                    // it will be expanded correctly when that one runs.
                    animation.tweens = propertiesMap;
                }
                else {
                    animation.tweens = Object.create(null);
                    expandProperties(animation, propertiesMap);
                }
                queue(element, animation, options.queue);
            }
        }
        if (StateObject.isTicking === false) {
            // If the animation tick isn't running, start it. (Velocity shuts it
            // off when there are no active calls to process.)
            tick(false);
        }
        if (animations) {
            defineProperty(elements.velocity, "animations", animations);
        }
    }
    /***************
     Chaining
     ***************/
    /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
    return elements || promise;
}
/**
 * Call an option callback in a try/catch block and report an error if needed.
 */
function optionCallback(fn, element, index, length, elements, option) {
    try {
        return fn.call(element, index, length, elements, option);
    }
    catch (e) {
        console.error(`VelocityJS: Exception when calling '${option}' callback:`, e);
    }
}
//# sourceMappingURL=velocityFn.js.map