"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const normalizations_1 = require("../normalizations");
function getAttribute(name) {
    return ((element, propertyValue) => {
        if (propertyValue === undefined) {
            return element.getAttribute(name);
        }
        element.setAttribute(name, propertyValue);
    });
}
const base = document.createElement("div"), rxSubtype = /^SVG(.*)Element$/, rxElement = /Element$/;
Object.getOwnPropertyNames(window)
    .forEach((property) => {
    const subtype = rxSubtype.exec(property);
    if (subtype && subtype[1] !== "SVG") {
        try {
            const element = subtype[1] ? document.createElementNS("http://www.w3.org/2000/svg", (subtype[1] || "svg").toLowerCase()) : document.createElement("svg");
            for (const attribute in element) {
                const value = element[attribute];
                if (types_1.isString(attribute)
                    && !(attribute[0] === "o" && attribute[1] === "n")
                    && attribute !== attribute.toUpperCase()
                    && !rxElement.test(attribute)
                    && !(attribute in base)
                    && !types_1.isFunction(value)) {
                    normalizations_1.registerNormalization([property, attribute, getAttribute(attribute)]);
                }
            }
        }
        catch (e) {
            console.error(`VelocityJS: Error when trying to identify SVG attributes on ${property}.`, e);
        }
    }
});
