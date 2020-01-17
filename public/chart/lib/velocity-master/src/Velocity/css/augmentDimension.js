"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPropertyValue_1 = require("./getPropertyValue");
function augmentDimension(element, name, wantInner) {
    const isBorderBox = getPropertyValue_1.getPropertyValue(element, "boxSizing")
        .toString()
        .toLowerCase() === "border-box";
    if (isBorderBox === wantInner) {
        const sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"], fields = [`padding${sides[0]}`, `padding${sides[1]}`, `border${sides[0]}Width`, `border${sides[1]}Width`];
        let augment = 0;
        for (const field of fields) {
            const value = parseFloat(getPropertyValue_1.getPropertyValue(element, field));
            if (!isNaN(value)) {
                augment += value;
            }
        }
        return wantInner ? -augment : augment;
    }
    return 0;
}
exports.augmentDimension = augmentDimension;
