
import * as R from "ramda"


/**
 * 保留小数位
 *
 * @param {number} v 值
 * @param {number} [len=2] 小数位数
 * @returns {number}
 */
const round = (v:number,len:number=2):number=>Math.round(v*Math.pow(10,len))/Math.pow(10,len)

/**
 * 千分位
 *
 * @param {(number|string)} v
 * @returns {string}
 */
const thousands=(v:number|string):string=>
    v.toString()
    .split(".")
    .map(function(item,i){
        return i==0
        ?R.reverse(R.splitEvery(3,R.reverse(item)).join(","))
        :item
    }).join(".")

/**
 * 金额
 *
 * @param {number} v
 * @returns {string}
 */
function amount(v:number):string{
    return thousands(round(v,2))
}

/**
 * 人民币
 *
 * @param {number} v
 * @returns {string}
 */
const RMB = (v:number):string => prefix("￥",amount(v).toString());

/**
 * 前缀
 *
 * @param {string} suffix
 * @param {string} str
 * @returns {string}
 */
const suffix = (suffix:string,str:string):string => [str,suffix].join("");

/**
 * 后缀2
 *
 * @param {string} prefix
 * @param {string} str
 * @returns {string}
 */
const prefix = (prefix:string,str:string):string => [prefix,str].join("");



/**
 * 百分比
 *
 * @param {number} v
 * @returns {string}
 */
const percentage=(v:number):string=>suffix("%",R.toString(v*100))

export {
    round,
    thousands,
    percentage
}
