"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPropertyValue_1 = require("../css/getPropertyValue");
const data_1 = require("../data");
const normalizations_1 = require("./normalizations");
exports.inlineRx = /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|let|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i, exports.listItemRx = /^(li)$/i, exports.tableRowRx = /^(tr)$/i, exports.tableRx = /^(table)$/i, exports.tableRowGroupRx = /^(tbody)$/i;
function display(element, propertyValue) {
    const style = element.style;
    if (propertyValue === undefined) {
        return getPropertyValue_1.computePropertyValue(element, "display");
    }
    if (propertyValue === "auto") {
        const nodeName = element && element.nodeName, data = data_1.Data(element);
        if (exports.inlineRx.test(nodeName)) {
            propertyValue = "inline";
        }
        else if (exports.listItemRx.test(nodeName)) {
            propertyValue = "list-item";
        }
        else if (exports.tableRowRx.test(nodeName)) {
            propertyValue = "table-row";
        }
        else if (exports.tableRx.test(nodeName)) {
            propertyValue = "table";
        }
        else if (exports.tableRowGroupRx.test(nodeName)) {
            propertyValue = "table-row-group";
        }
        else {
            propertyValue = "block";
        }
        data.cache["display"] = propertyValue;
    }
    style.display = propertyValue;
}
normalizations_1.registerNormalization(["Element", "display", display]);
