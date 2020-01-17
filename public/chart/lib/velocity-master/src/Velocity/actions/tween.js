"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utility_1 = require("../../utility");
const defaults_1 = require("../defaults");
const easings_1 = require("../easing/easings");
const options_1 = require("../options");
const sequences_1 = require("../sequences");
const sequencesObject_1 = require("../sequencesObject");
const tweens_1 = require("../tweens");
const actions_1 = require("./actions");
const constants_1 = require("../../constants");
function tweenAction(args, elements, promiseHandler, action) {
    let requireForcefeeding;
    if (!elements) {
        if (!args.length) {
            console.info(`Velocity(<element>, \"tween\", percentComplete, property, end | [end, <easing>, <start>], <easing>) => value
Velocity(<element>, \"tween\", percentComplete, {property: end | [end, <easing>, <start>], ...}, <easing>) => {property: value, ...}`);
            return null;
        }
        elements = [document.body];
        requireForcefeeding = true;
    }
    else if (elements.length !== 1) {
        throw new Error("VelocityJS: Cannot tween more than one element!");
    }
    const percentComplete = args[0], fakeAnimation = {
        elements,
        element: elements[0],
        queue: false,
        options: {
            duration: 1000,
        },
        tweens: null,
    }, result = {};
    let properties = args[1], singleResult, maybeSequence, easing = args[2], count = 0;
    if (types_1.isString(args[1])) {
        if (sequencesObject_1.SequencesObject && sequencesObject_1.SequencesObject[args[1]]) {
            maybeSequence = sequencesObject_1.SequencesObject[args[1]];
            properties = {};
            easing = args[2];
        }
        else {
            singleResult = true;
            properties = {
                [args[1]]: args[2],
            };
            easing = args[3];
        }
    }
    else if (Array.isArray(args[1])) {
        singleResult = true;
        properties = {
            tween: args[1],
        };
        easing = args[2];
    }
    if (!types_1.isNumber(percentComplete) || percentComplete < 0 || percentComplete > 1) {
        throw new Error("VelocityJS: Must tween a percentage from 0 to 1!");
    }
    if (!types_1.isPlainObject(properties)) {
        throw new Error("VelocityJS: Cannot tween an invalid property!");
    }
    if (requireForcefeeding) {
        for (const property in properties) {
            if (properties.hasOwnProperty(property) && (!Array.isArray(properties[property]) || properties[property].length < 2)) {
                throw new Error("VelocityJS: When not supplying an element you must force-feed values: " + property);
            }
        }
    }
    const activeEasing = options_1.validateEasing(utility_1.getValue(easing, defaults_1.defaults.easing), constants_1.DEFAULT_DURATION);
    if (maybeSequence) {
        sequences_1.expandSequence(fakeAnimation, maybeSequence);
    }
    else {
        tweens_1.expandProperties(fakeAnimation, properties);
    }
    for (const property in fakeAnimation.tweens) {
        const propertyTween = fakeAnimation.tweens[property], sequence = propertyTween.sequence, pattern = sequence.pattern;
        let currentValue = "", i = 0;
        count++;
        if (pattern) {
            const easingComplete = (propertyTween.easing || activeEasing)(percentComplete, 0, 1, property);
            let best = 0;
            for (let j = 0; j < sequence.length - 1; j++) {
                if (sequence[j].percent < easingComplete) {
                    best = j;
                }
            }
            const tweenFrom = sequence[best], tweenTo = sequence[best + 1] || tweenFrom, tweenPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent), tweenEasing = tweenTo.easing || easings_1.linearEasing;
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
                        const value = tweenEasing(tweenPercent, startValue, endValue, property);
                        currentValue += pattern[i] === true ? Math.round(value) : value;
                    }
                }
            }
            result[property] = currentValue;
        }
    }
    if (singleResult && count === 1) {
        for (const property in result) {
            if (result.hasOwnProperty(property)) {
                return result[property];
            }
        }
    }
    return result;
}
actions_1.registerAction(["tween", tweenAction], true);
