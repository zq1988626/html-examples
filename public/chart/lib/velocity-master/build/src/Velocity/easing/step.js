/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details
 *
 * Step easing generator.
 */
// Constants
const cache = {};
export function generateStep(steps) {
    const fn = cache[steps];
    if (fn) {
        return fn;
    }
    return cache[steps] = (percentComplete, startValue, endValue) => {
        if (percentComplete === 0) {
            return startValue;
        }
        if (percentComplete === 1) {
            return endValue;
        }
        return startValue + Math.round(percentComplete * steps) * (1 / steps) * (endValue - startValue);
    };
}
//# sourceMappingURL=step.js.map