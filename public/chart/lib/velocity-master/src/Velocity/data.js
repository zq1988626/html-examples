"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const normalizationsObject_1 = require("./normalizations/normalizationsObject");
const dataName = "velocityData";
function Data(element) {
    const data = element[dataName];
    if (data) {
        return data;
    }
    const window = element.ownerDocument.defaultView;
    let types = 0;
    for (let index = 0; index < normalizationsObject_1.constructors.length; index++) {
        const constructor = normalizationsObject_1.constructors[index];
        if (types_1.isString(constructor)) {
            if (element instanceof window[constructor]) {
                types |= 1 << index;
            }
        }
        else if (element instanceof constructor) {
            types |= 1 << index;
        }
    }
    const newData = {
        types,
        count: 0,
        computedStyle: null,
        cache: {},
        queueList: {},
        lastAnimationList: {},
        lastFinishList: {},
        window,
    };
    Object.defineProperty(element, dataName, {
        value: newData,
    });
    return newData;
}
exports.Data = Data;
