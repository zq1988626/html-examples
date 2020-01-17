"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const velocity_1 = require("../velocity");
const actions_1 = require("./actions/actions");
const camelCase_1 = require("./camelCase");
const normalizations_1 = require("./normalizations/normalizations");
const options_1 = require("./options");
const sequencesObject_1 = require("./sequencesObject");
const tweens_1 = require("./tweens");
const constants_1 = require("../constants");
const rxPercents = /(\d*\.\d+|\d+\.?|from|to)/g;
function expandSequence(animation, sequence) {
    const tweens = animation.tweens = Object.create(null), element = animation.element;
    for (const propertyName in sequence.tweens) {
        if (sequence.tweens.hasOwnProperty(propertyName)) {
            const fn = normalizations_1.getNormalization(element, propertyName);
            if (!fn && propertyName !== "tween") {
                if (velocity_1.default.debug) {
                    console.log(`Skipping [${propertyName}] due to a lack of browser support.`);
                }
                continue;
            }
            tweens[propertyName] = {
                fn,
                sequence: sequence.tweens[propertyName],
            };
        }
    }
}
exports.expandSequence = expandSequence;
function registerSequence(args) {
    if (types_1.isPlainObject(args[0])) {
        for (const name in args[0]) {
            if (args[0].hasOwnProperty(name)) {
                registerSequence([name, args[0][name]]);
            }
        }
    }
    else if (types_1.isString(args[0])) {
        const name = args[0], sequence = args[1];
        if (!types_1.isString(name)) {
            console.warn(`VelocityJS: Trying to set 'registerSequence' name to an invalid value:`, name);
        }
        else if (!types_1.isPlainObject(sequence)) {
            console.warn(`VelocityJS: Trying to set 'registerSequence' sequence to an invalid value:`, name, sequence);
        }
        else {
            if (sequencesObject_1.SequencesObject[name]) {
                console.warn(`VelocityJS: Replacing named sequence:`, name);
            }
            const percents = {}, steps = new Array(100), properties = [], percentages = [], sequenceList = sequencesObject_1.SequencesObject[name] = {}, duration = options_1.validateDuration(sequence.duration);
            sequenceList.tweens = {};
            if (types_1.isNumber(duration)) {
                sequenceList.duration = duration;
            }
            for (const part in sequence) {
                if (sequence.hasOwnProperty(part)) {
                    const keys = String(part)
                        .match(rxPercents);
                    if (keys) {
                        percentages.push(part);
                        for (const key of keys) {
                            const percent = key === "from"
                                ? 0
                                : key === "to"
                                    ? 100
                                    : parseFloat(key);
                            if (percent < 0 || percent > 100) {
                                console.warn(`VelocityJS: Trying to use an invalid value as a percentage (0 <= n <= 100):`, name, percent);
                            }
                            else if (isNaN(percent)) {
                                console.warn(`VelocityJS: Trying to use an invalid number as a percentage:`, name, part, key);
                            }
                            else {
                                if (!percents[String(percent)]) {
                                    percents[String(percent)] = [];
                                }
                                percents[String(percent)].push(part);
                                for (const property in sequence[part]) {
                                    if (!properties.includes(property)) {
                                        properties.push(property);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const orderedPercents = Object.keys(percents)
                .sort((a, b) => {
                const a1 = parseFloat(a), b1 = parseFloat(b);
                return a1 > b1 ? 1 : a1 < b1 ? -1 : 0;
            });
            orderedPercents.forEach((key) => {
                steps.push.apply(percents[key]);
            });
            for (const property of properties) {
                const parts = [], propertyName = camelCase_1.camelCase(property);
                for (const key of orderedPercents) {
                    for (const value of percents[key]) {
                        const stepProperties = sequence[value];
                        if (stepProperties[propertyName]) {
                            parts.push(types_1.isString(stepProperties[propertyName])
                                ? stepProperties[propertyName]
                                : stepProperties[propertyName][0]);
                        }
                    }
                }
                if (parts.length) {
                    const realSequence = tweens_1.findPattern(parts, propertyName);
                    let index = 0;
                    if (realSequence) {
                        for (const key of orderedPercents) {
                            for (const value of percents[key]) {
                                const originalProperty = sequence[value][propertyName];
                                if (originalProperty) {
                                    if (Array.isArray(originalProperty) && originalProperty.length > 1 && (types_1.isString(originalProperty[1]) || Array.isArray(originalProperty[1]))) {
                                        realSequence[index].easing = options_1.validateEasing(originalProperty[1], sequenceList.duration || constants_1.DEFAULT_DURATION);
                                    }
                                    realSequence[index++].percent = parseFloat(key) / 100;
                                }
                            }
                        }
                        sequenceList.tweens[propertyName] = realSequence;
                    }
                }
            }
        }
    }
}
exports.registerSequence = registerSequence;
actions_1.registerAction(["registerSequence", registerSequence], true);
