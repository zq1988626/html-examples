/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */
// Project
import { isNumber, isPlainObject, isString } from "../../types";
import { getValue } from "../../utility";
import { defaults } from "../defaults";
import { linearEasing } from "../easing/easings";
import { validateEasing } from "../options";
import { expandSequence } from "../sequences";
import { SequencesObject } from "../sequencesObject";
import { expandProperties } from "../tweens";
import { registerAction } from "./actions";
// Constants
import { DEFAULT_DURATION } from "../../constants";
/**
 *
 */
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
        // TODO: Allow more than a single element to return an array of results
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
    if (isString(args[1])) {
        if (SequencesObject && SequencesObject[args[1]]) {
            maybeSequence = SequencesObject[args[1]];
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
    if (!isNumber(percentComplete) || percentComplete < 0 || percentComplete > 1) {
        throw new Error("VelocityJS: Must tween a percentage from 0 to 1!");
    }
    if (!isPlainObject(properties)) {
        throw new Error("VelocityJS: Cannot tween an invalid property!");
    }
    if (requireForcefeeding) {
        for (const property in properties) {
            if (properties.hasOwnProperty(property) && (!Array.isArray(properties[property]) || properties[property].length < 2)) {
                throw new Error("VelocityJS: When not supplying an element you must force-feed values: " + property);
            }
        }
    }
    const activeEasing = validateEasing(getValue(easing, defaults.easing), DEFAULT_DURATION);
    if (maybeSequence) {
        expandSequence(fakeAnimation, maybeSequence);
    }
    else {
        expandProperties(fakeAnimation, properties);
    }
    // tslint:disable-next-line:forin
    for (const property in fakeAnimation.tweens) {
        // For every element, iterate through each property.
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
            const tweenFrom = sequence[best], tweenTo = sequence[best + 1] || tweenFrom, tweenPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent), tweenEasing = tweenTo.easing || linearEasing;
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
                        // All easings must deal with numbers except for our internal ones.
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
registerAction(["tween", tweenAction], true);
//# sourceMappingURL=tween.js.map