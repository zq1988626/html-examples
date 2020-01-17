"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const utility_1 = require("../utility");
const velocity_1 = require("../velocity");
const camelCase_1 = require("./camelCase");
const fixColors_1 = require("./css/fixColors");
const getPropertyValue_1 = require("./css/getPropertyValue");
const data_1 = require("./data");
const defaults_1 = require("./defaults");
const easings_1 = require("./easing/easings");
const normalizations_1 = require("./normalizations/normalizations");
const options_1 = require("./options");
const state_1 = require("./state");
const rxHex = /^#([A-f\d]{3}){1,2}$/i, commands = {
    function: (value, element, elements, elementArrayIndex, propertyName, tween) => {
        return value.call(element, elementArrayIndex, elements.length, propertyName);
    },
    number: (value, element, elements, elementArrayIndex, propertyName, tween) => {
        return String(value) + normalizations_1.getNormalizationUnit(tween.fn);
    },
    string: (value, element, elements, elementArrayIndex, propertyName, tween) => {
        return fixColors_1.fixColors(value);
    },
    undefined: (value, element, elements, elementArrayIndex, propertyName, tween) => {
        return fixColors_1.fixColors(getPropertyValue_1.getPropertyValue(element, propertyName, tween.fn) || "");
    },
};
function expandProperties(animation, properties) {
    const tweens = animation.tweens = Object.create(null), elements = animation.elements, element = animation.element, elementArrayIndex = elements.indexOf(element), data = data_1.Data(element), queue = utility_1.getValue(animation.queue, animation.options.queue), duration = utility_1.getValue(animation.options.duration, defaults_1.defaults.duration);
    for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
            const propertyName = camelCase_1.camelCase(property), fn = normalizations_1.getNormalization(element, propertyName);
            let valueData = properties[property];
            if (!fn && propertyName !== "tween") {
                if (velocity_1.default.debug) {
                    console.log(`Skipping "${property}" due to a lack of browser support.`);
                }
                continue;
            }
            if (valueData == null) {
                if (velocity_1.default.debug) {
                    console.log(`Skipping "${property}" due to no value supplied.`);
                }
                continue;
            }
            const tween = tweens[propertyName] = {};
            let endValue, startValue;
            tween.fn = fn;
            if (types_1.isFunction(valueData)) {
                valueData = valueData.call(element, elementArrayIndex, elements.length, elements);
            }
            if (Array.isArray(valueData)) {
                const arr1 = valueData[1], arr2 = valueData[2];
                endValue = valueData[0];
                if ((types_1.isString(arr1) && (/^[\d-]/.test(arr1) || rxHex.test(arr1))) || types_1.isFunction(arr1) || types_1.isNumber(arr1)) {
                    startValue = arr1;
                }
                else if ((types_1.isString(arr1) && easings_1.Easings[arr1]) || Array.isArray(arr1)) {
                    tween.easing = options_1.validateEasing(arr1, duration);
                    startValue = arr2;
                }
                else {
                    startValue = arr1 || arr2;
                }
            }
            else {
                endValue = valueData;
            }
            tween.end = commands[typeof endValue](endValue, element, elements, elementArrayIndex, propertyName, tween);
            if (startValue != null || (queue === false || data.queueList[queue] === undefined)) {
                tween.start = commands[typeof startValue](startValue, element, elements, elementArrayIndex, propertyName, tween);
                explodeTween(propertyName, tween, duration);
            }
        }
    }
}
exports.expandProperties = expandProperties;
const rxToken = /((?:[+\-*/]=)?(?:[+-]?\d*\.\d+|[+-]?\d+)[a-z%]*|(?:.(?!$|[+-]?\d|[+\-*/]=[+-]?\d))+.|.)/g, rxNumber = /^([+\-*/]=)?([+-]?\d*\.\d+|[+-]?\d+)(.*)$/;
function findPattern(parts, propertyName) {
    const partsLength = parts.length, tokens = [], indexes = [];
    let numbers;
    for (let part = 0; part < partsLength; part++) {
        if (types_1.isString(parts[part])) {
            if (parts[part] === "") {
                tokens[part] = [""];
            }
            else {
                tokens[part] = utility_1.cloneArray(parts[part].match(rxToken));
            }
            indexes[part] = 0;
            numbers = numbers || tokens[part].length > 1;
        }
        else {
            return;
        }
    }
    const sequence = [], pattern = (sequence.pattern = []), addString = (text) => {
        if (types_1.isString(pattern[pattern.length - 1])) {
            pattern[pattern.length - 1] += text;
        }
        else if (text) {
            pattern.push(text);
            for (let part = 0; part < partsLength; part++) {
                sequence[part].push(null);
            }
        }
    }, returnStringType = () => {
        if (numbers || pattern.length > 1) {
            return;
        }
        const isDisplay = propertyName === "display", isVisibility = propertyName === "visibility";
        for (let part = 0; part < partsLength; part++) {
            const value = parts[part];
            sequence[part][0] = value;
            sequence[part].easing = options_1.validateEasing((isDisplay && value === "none") || (isVisibility && value === "hidden") || (!isDisplay && !isVisibility) ? "at-end" : "at-start", 400);
        }
        pattern[0] = false;
        return sequence;
    };
    let more = true;
    for (let part = 0; part < partsLength; part++) {
        sequence[part] = [];
    }
    while (more) {
        const bits = [], units = [];
        let text, isUnitless = false, hasNumbers = false;
        for (let part = 0; part < partsLength; part++) {
            const index = indexes[part]++, token = tokens[part][index];
            if (token) {
                const num = token.match(rxNumber);
                if (num) {
                    if (text) {
                        return returnStringType();
                    }
                    const digits = parseFloat(num[2]), unit = num[3], change = num[1] ? num[1][0] + unit : undefined, changeOrUnit = change || unit;
                    if (digits && !units.includes(changeOrUnit)) {
                        units.push(changeOrUnit);
                    }
                    if (!unit) {
                        if (digits) {
                            hasNumbers = true;
                        }
                        else {
                            isUnitless = true;
                        }
                    }
                    bits[part] = change ? [digits, changeOrUnit, true] : [digits, changeOrUnit];
                }
                else if (bits.length) {
                    return returnStringType();
                }
                else {
                    if (!text) {
                        text = token;
                    }
                    else if (text !== token) {
                        return returnStringType();
                    }
                }
            }
            else if (!part) {
                for (; part < partsLength; part++) {
                    const index2 = indexes[part]++;
                    if (tokens[part][index2]) {
                        return returnStringType();
                    }
                }
                more = false;
                break;
            }
            else {
                return;
            }
        }
        if (text) {
            addString(text);
        }
        else if (units.length) {
            if (units.length === 2 && isUnitless && !hasNumbers) {
                units.splice(units[0] ? 1 : 0, 1);
            }
            if (units.length === 1) {
                const unit = units[0], firstLetter = unit[0];
                switch (firstLetter) {
                    case "+":
                    case "-":
                    case "*":
                    case "/":
                        if (propertyName) {
                            console.error(`Velocity: The first property must not contain a relative function "${propertyName}":`, parts);
                        }
                        return;
                }
                pattern.push(false);
                for (let part = 0; part < partsLength; part++) {
                    sequence[part].push(bits[part][0]);
                }
                addString(unit);
            }
            else {
                addString("calc(");
                const patternCalc = pattern.length - 1;
                for (let i = 0; i < units.length; i++) {
                    const unit = units[i], firstLetter = unit[0], isComplex = firstLetter === "*" || firstLetter === "/", isMaths = isComplex || firstLetter === "+" || firstLetter === "-";
                    if (isComplex) {
                        pattern[patternCalc] += "(";
                        addString(")");
                    }
                    if (i) {
                        addString(` ${isMaths ? firstLetter : "+"} `);
                    }
                    pattern.push(false);
                    for (let part = 0; part < partsLength; part++) {
                        const bit = bits[part], value = bit[1] === unit
                            ? bit[0]
                            : bit.length === 3
                                ? sequence[part - 1][sequence[part - 1].length - 1]
                                : isComplex ? 1 : 0;
                        sequence[part].push(value);
                    }
                    addString(isMaths ? unit.substring(1) : unit);
                }
                addString(")");
            }
        }
    }
    for (let i = 0, inRGB = 0; i < pattern.length; i++) {
        const text = pattern[i];
        if (types_1.isString(text)) {
            if (inRGB && text.indexOf(",") >= 0) {
                inRGB++;
            }
            else if (text.indexOf("rgb") >= 0) {
                inRGB = 1;
            }
        }
        else if (inRGB) {
            if (inRGB < 4) {
                pattern[i] = true;
            }
            else {
                inRGB = 0;
            }
        }
    }
    return sequence;
}
exports.findPattern = findPattern;
function explodeTween(propertyName, tween, duration, starting) {
    const startValue = tween.start, endValue = tween.end;
    if (!types_1.isString(endValue) || !types_1.isString(startValue)) {
        return;
    }
    let sequence = findPattern([startValue, endValue], propertyName);
    if (!sequence && starting) {
        const startNumbers = startValue.match(/\d\.?\d*/g) || ["0"], count = startNumbers.length;
        let index = 0;
        sequence = findPattern([endValue.replace(/\d+\.?\d*/g, () => {
                return startNumbers[index++ % count];
            }), endValue], propertyName);
    }
    if (sequence) {
        if (velocity_1.default.debug) {
            console.log(`Velocity: Sequence found:`, sequence);
        }
        sequence[0].percent = 0;
        sequence[1].percent = 1;
        tween.sequence = sequence;
        switch (tween.easing) {
            case easings_1.Easings["at-start"]:
            case easings_1.Easings["during"]:
            case easings_1.Easings["at-end"]:
                sequence[0].easing = sequence[1].easing = tween.easing;
                break;
        }
    }
}
function validateTweens(activeCall) {
    if (state_1.State.firstNew === activeCall) {
        state_1.State.firstNew = activeCall._next;
    }
    if (activeCall._flags & 1) {
        return;
    }
    const element = activeCall.element, tweens = activeCall.tweens, duration = utility_1.getValue(activeCall.options.duration, defaults_1.defaults.duration);
    for (const propertyName in tweens) {
        const tween = tweens[propertyName];
        if (tween.start == null) {
            const startValue = getPropertyValue_1.getPropertyValue(activeCall.element, propertyName);
            if (types_1.isString(startValue)) {
                tween.start = fixColors_1.fixColors(startValue);
                explodeTween(propertyName, tween, duration, true);
            }
            else if (!Array.isArray(startValue)) {
                console.warn(`bad type`, tween, propertyName, startValue);
            }
        }
        if (velocity_1.default.debug) {
            console.log(`tweensContainer "${propertyName}": ${JSON.stringify(tween)}`, element);
        }
    }
    activeCall._flags |= 1;
}
exports.validateTweens = validateTweens;
