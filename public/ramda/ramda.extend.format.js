"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var R = __importStar(require("ramda"));
/**
 * 保留小数位
 *
 * @param {number} v 值
 * @param {number} [len=2] 小数位数
 * @returns {number}
 */
var round = function (v, len) {
    if (len === void 0) { len = 2; }
    return Math.round(v * Math.pow(10, len)) / Math.pow(10, len);
};
exports.round = round;
/**
 * 千分位
 *
 * @param {(number|string)} v
 * @returns {string}
 */
var thousands = function (v) {
    return v.toString()
        .split(".")
        .map(function (item, i) {
        return i == 0
            ? R.reverse(R.splitEvery(3, R.reverse(item)).join(","))
            : item;
    }).join(".");
};
exports.thousands = thousands;
/**
 * 金额
 *
 * @param {number} v
 * @returns {string}
 */
function amount(v) {
    return thousands(round(v, 2));
}
/**
 * 人民币
 *
 * @param {number} v
 * @returns {string}
 */
var RMB = function (v) { return prefix("￥", amount(v).toString()); };
/**
 * 前缀
 *
 * @param {string} suffix
 * @param {string} str
 * @returns {string}
 */
var suffix = function (suffix, str) { return [str, suffix].join(""); };
/**
 * 后缀2
 *
 * @param {string} prefix
 * @param {string} str
 * @returns {string}
 */
var prefix = function (prefix, str) { return [prefix, str].join(""); };
/**
 * 百分比
 *
 * @param {number} v
 * @returns {string}
 */
var percentage = function (v) { return suffix("%", R.toString(v * 100)); };
exports.percentage = percentage;
