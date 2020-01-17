"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPropertyValue_1 = require("../css/getPropertyValue");
const normalizations_1 = require("./normalizations");
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
            getPropertyValue_1.getPropertyValue(element, "client" + direction, null, true);
            getPropertyValue_1.getPropertyValue(element, "scroll" + direction, null, true);
            return element["scroll" + end] + "px";
        }
        const value = parseFloat(propertyValue), unit = propertyValue.replace(String(value), "");
        switch (unit) {
            case "":
            case "px":
                element["scroll" + end] = value;
                break;
            case "%":
                const client = parseFloat(getPropertyValue_1.getPropertyValue(element, "client" + direction)), scrollValue = parseFloat(getPropertyValue_1.getPropertyValue(element, "scroll" + direction));
                element["scroll" + end] = Math.max(0, scrollValue - client) * value / 100;
                break;
        }
    });
}
normalizations_1.registerNormalization(["HTMLElement", "scroll", scroll("Height", "Top"), false]);
normalizations_1.registerNormalization(["HTMLElement", "scrollTop", scroll("Height", "Top"), false]);
normalizations_1.registerNormalization(["HTMLElement", "scrollLeft", scroll("Width", "Left"), false]);
normalizations_1.registerNormalization(["HTMLElement", "scrollWidth", scrollWidth]);
normalizations_1.registerNormalization(["HTMLElement", "clientWidth", clientWidth]);
normalizations_1.registerNormalization(["HTMLElement", "scrollHeight", scrollHeight]);
normalizations_1.registerNormalization(["HTMLElement", "clientHeight", clientHeight]);
