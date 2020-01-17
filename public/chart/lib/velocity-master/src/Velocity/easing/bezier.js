"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easings_1 = require("./easings");
function fixRange(num) {
    return Math.min(Math.max(num, 0), 1);
}
function A(aA1, aA2) {
    return 1 - 3 * aA2 + 3 * aA1;
}
function B(aA1, aA2) {
    return 3 * aA2 - 6 * aA1;
}
function C(aA1) {
    return 3 * aA1;
}
function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}
function getSlope(aT, aA1, aA2) {
    return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
}
function generateBezier(mX1, mY1, mX2, mY2) {
    const NEWTON_ITERATIONS = 4, NEWTON_MIN_SLOPE = 0.001, SUBDIVISION_PRECISION = 0.0000001, SUBDIVISION_MAX_ITERATIONS = 10, kSplineTableSize = 11, kSampleStepSize = 1 / (kSplineTableSize - 1), float32ArraySupported = "Float32Array" in window;
    if (arguments.length !== 4) {
        return;
    }
    for (let i = 0; i < 4; ++i) {
        if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
            return;
        }
    }
    mX1 = fixRange(mX1);
    mX2 = fixRange(mX2);
    const mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    function newtonRaphsonIterate(aX, aGuessT) {
        for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
            const currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0) {
                return aGuessT;
            }
            const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
    function calcSampleValues() {
        for (let i = 0; i < kSplineTableSize; ++i) {
            mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
    }
    function binarySubdivide(aX, aA, aB) {
        let currentX, currentT, i = 0;
        do {
            currentT = aA + (aB - aA) / 2;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0) {
                aB = currentT;
            }
            else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }
    function getTForX(aX) {
        const lastSample = kSplineTableSize - 1;
        let intervalStart = 0, currentSample = 1;
        for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;
        const dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]), guessForT = intervalStart + dist * kSampleStepSize, initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT);
        }
        else if (initialSlope === 0) {
            return guessForT;
        }
        else {
            return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
        }
    }
    let precomputed = false;
    function precompute() {
        precomputed = true;
        if (mX1 !== mY1 || mX2 !== mY2) {
            calcSampleValues();
        }
    }
    const str = `generateBezier(${[mX1, mY1, mX2, mY2]})`, f = (percentComplete, startValue, endValue, property) => {
        if (!precomputed) {
            precompute();
        }
        if (percentComplete === 0) {
            return startValue;
        }
        if (percentComplete === 1) {
            return endValue;
        }
        if (mX1 === mY1 && mX2 === mY2) {
            return startValue + percentComplete * (endValue - startValue);
        }
        return startValue + calcBezier(getTForX(percentComplete), mY1, mY2) * (endValue - startValue);
    };
    f.getControlPoints = () => {
        return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }];
    };
    f.toString = () => {
        return str;
    };
    return f;
}
exports.generateBezier = generateBezier;
const easeIn = generateBezier(0.42, 0, 1, 1), easeOut = generateBezier(0, 0, 0.58, 1), easeInOut = generateBezier(0.42, 0, 0.58, 1);
easings_1.registerEasing(["ease", generateBezier(0.25, 0.1, 0.25, 1)]);
easings_1.registerEasing(["easeIn", easeIn]);
easings_1.registerEasing(["ease-in", easeIn]);
easings_1.registerEasing(["easeOut", easeOut]);
easings_1.registerEasing(["ease-out", easeOut]);
easings_1.registerEasing(["easeInOut", easeInOut]);
easings_1.registerEasing(["ease-in-out", easeInOut]);
easings_1.registerEasing(["easeInSine", generateBezier(0.47, 0, 0.745, 0.715)]);
easings_1.registerEasing(["easeOutSine", generateBezier(0.39, 0.575, 0.565, 1)]);
easings_1.registerEasing(["easeInOutSine", generateBezier(0.445, 0.05, 0.55, 0.95)]);
easings_1.registerEasing(["easeInQuad", generateBezier(0.55, 0.085, 0.68, 0.53)]);
easings_1.registerEasing(["easeOutQuad", generateBezier(0.25, 0.46, 0.45, 0.94)]);
easings_1.registerEasing(["easeInOutQuad", generateBezier(0.455, 0.03, 0.515, 0.955)]);
easings_1.registerEasing(["easeInCubic", generateBezier(0.55, 0.055, 0.675, 0.19)]);
easings_1.registerEasing(["easeOutCubic", generateBezier(0.215, 0.61, 0.355, 1)]);
easings_1.registerEasing(["easeInOutCubic", generateBezier(0.645, 0.045, 0.355, 1)]);
easings_1.registerEasing(["easeInQuart", generateBezier(0.895, 0.03, 0.685, 0.22)]);
easings_1.registerEasing(["easeOutQuart", generateBezier(0.165, 0.84, 0.44, 1)]);
easings_1.registerEasing(["easeInOutQuart", generateBezier(0.77, 0, 0.175, 1)]);
easings_1.registerEasing(["easeInQuint", generateBezier(0.755, 0.05, 0.855, 0.06)]);
easings_1.registerEasing(["easeOutQuint", generateBezier(0.23, 1, 0.32, 1)]);
easings_1.registerEasing(["easeInOutQuint", generateBezier(0.86, 0, 0.07, 1)]);
easings_1.registerEasing(["easeInExpo", generateBezier(0.95, 0.05, 0.795, 0.035)]);
easings_1.registerEasing(["easeOutExpo", generateBezier(0.19, 1, 0.22, 1)]);
easings_1.registerEasing(["easeInOutExpo", generateBezier(1, 0, 0, 1)]);
easings_1.registerEasing(["easeInCirc", generateBezier(0.6, 0.04, 0.98, 0.335)]);
easings_1.registerEasing(["easeOutCirc", generateBezier(0.075, 0.82, 0.165, 1)]);
easings_1.registerEasing(["easeInOutCirc", generateBezier(0.785, 0.135, 0.15, 0.86)]);