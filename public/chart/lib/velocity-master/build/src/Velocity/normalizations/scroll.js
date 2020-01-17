/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
// Project
import { getPropertyValue } from "../css/getPropertyValue";
import { registerNormalization } from "./normalizations";
function clientWidth(element, propertyValue) {
    if (propertyValue == null) {
        return element.clientWidth + "px";
    }
}
function scrollWidth(element, propertyValue) {
    if (propertyValue == null) {
        return element.scrollWidth + "px";
    }
}
function clientHeight(element, propertyValue) {
    if (propertyValue == null) {
        return element.clientHeight + "px";
    }
}
function scrollHeight(element, propertyValue) {
    if (propertyValue == null) {
        return element.scrollHeight + "px";
    }
}
function scroll(direction, end) {
    return ((element, propertyValue) => {
        if (propertyValue == null) {
            // Make sure we have these values cached.
            getPropertyValue(element, "client" + direction, null, true);
            getPropertyValue(element, "scroll" + direction, null, true);
            return element["scroll" + end] + "px";
        }
        const value = parseFloat(propertyValue), unit = propertyValue.replace(String(value), "");
        switch (unit) {
            case "":
            case "px":
                element["scroll" + end] = value;
                break;
            case "%":
                const client = parseFloat(getPropertyValue(element, "client" + direction)), scrollValue = parseFloat(getPropertyValue(element, "scroll" + direction));
                element["scroll" + end] = Math.max(0, scrollValue - client) * value / 100;
                break;
        }
    });
}
registerNormalization(["HTMLElement", "scroll", scroll("Height", "Top"), false]);
registerNormalization(["HTMLElement", "scrollTop", scroll("Height", "Top"), false]);
registerNormalization(["HTMLElement", "scrollLeft", scroll("Width", "Left"), false]);
registerNormalization(["HTMLElement", "scrollWidth", scrollWidth]);
registerNormalization(["HTMLElement", "clientWidth", clientWidth]);
registerNormalization(["HTMLElement", "scrollHeight", scrollHeight]);
registerNormalization(["HTMLElement", "clientHeight", clientHeight]);
//# sourceMappingURL=scroll.js.map