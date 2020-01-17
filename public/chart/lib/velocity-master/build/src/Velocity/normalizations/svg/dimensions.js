/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
// Project
import { registerNormalization } from "../normalizations";
/**
 * Get/set the width or height.
 */
function getDimension(name) {
    return ((element, propertyValue) => {
        if (propertyValue === undefined) {
            // Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM.
            try {
                return element.getBBox()[name] + "px";
            }
            catch (e) {
                return "0px";
            }
        }
        element.setAttribute(name, propertyValue);
    });
}
registerNormalization(["SVGElement", "width", getDimension("width")]);
registerNormalization(["SVGElement", "height", getDimension("height")]);
//# sourceMappingURL=dimensions.js.map