"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const getPropertyValue_1 = require("../css/getPropertyValue");
const state_1 = require("../state");
const normalizations_1 = require("./normalizations");
const rxAddPx = /^(b(lockSize|o(rder(Bottom(LeftRadius|RightRadius|Width)|Image(Outset|Width)|LeftWidth|R(adius|ightWidth)|Spacing|Top(LeftRadius|RightRadius|Width)|Width)|ttom))|column(Gap|RuleWidth|Width)|f(lexBasis|ontSize)|grid(ColumnGap|Gap|RowGap)|height|inlineSize|le(ft|tterSpacing)|m(a(rgin(Bottom|Left|Right|Top)|x(BlockSize|Height|InlineSize|Width))|in(BlockSize|Height|InlineSize|Width))|o(bjectPosition|utline(Offset|Width))|p(adding(Bottom|Left|Right|Top)|erspective)|right|s(hapeMargin|troke(Dashoffset|Width))|t(extIndent|op|ransformOrigin)|w(idth|ordSpacing))$/;
function getSetPrefixed(propertyName, unprefixed) {
    return ((element, propertyValue) => {
        if (propertyValue === undefined) {
            return getPropertyValue_1.computePropertyValue(element, propertyName) || getPropertyValue_1.computePropertyValue(element, unprefixed);
        }
        element.style[propertyName] = element.style[unprefixed] = propertyValue;
    });
}
function getSetStyle(propertyName) {
    return ((element, propertyValue) => {
        if (propertyValue === undefined) {
            return getPropertyValue_1.computePropertyValue(element, propertyName);
        }
        element.style[propertyName] = propertyValue;
    });
}
const rxVendors = /^(webkit|moz|ms|o)[A-Z]/, prefixElement = state_1.State.prefixElement;
if (prefixElement) {
    for (const propertyName in prefixElement.style) {
        if (rxVendors.test(propertyName)) {
            const unprefixed = propertyName.replace(/^[a-z]+([A-Z])/, ($, letter) => letter.toLowerCase());
            if (constants_1.ALL_VENDOR_PREFIXES || types_1.isString(prefixElement.style[unprefixed])) {
                const addUnit = rxAddPx.test(unprefixed) ? "px" : undefined;
                normalizations_1.registerNormalization(["Element", unprefixed, getSetPrefixed(propertyName, unprefixed), addUnit]);
            }
        }
        else if (!normalizations_1.hasNormalization(["Element", propertyName])) {
            const addUnit = rxAddPx.test(propertyName) ? "px" : undefined;
            normalizations_1.registerNormalization(["Element", propertyName, getSetStyle(propertyName), addUnit]);
        }
    }
}
