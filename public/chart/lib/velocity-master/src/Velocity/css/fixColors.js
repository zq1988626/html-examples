"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxColor6 = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/gi, rxColor3 = /#([a-f\d])([a-f\d])([a-f\d])/gi, rxColorName = /(rgba?\(\s*)?(\b[a-z]+\b)/g, rxRGB = /rgb(a?)\(([^\)]+)\)/gi, rxSpaces = /\s+/g;
exports.ColorNames = {};
function makeRGBA(ignore, r, g, b) {
    return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},1)`;
}
function fixColors(str) {
    return str
        .replace(rxColor6, makeRGBA)
        .replace(rxColor3, ($0, r, g, b) => {
        return makeRGBA($0, r + r, g + g, b + b);
    })
        .replace(rxColorName, ($0, $1, $2) => {
        if (exports.ColorNames[$2]) {
            return ($1 ? $1 : "rgba(") + exports.ColorNames[$2] + ($1 ? "" : ",1)");
        }
        return $0;
    })
        .replace(rxRGB, ($0, $1, $2) => {
        return `rgba(${$2.replace(rxSpaces, "") + ($1 ? "" : ",1")})`;
    });
}
exports.fixColors = fixColors;
