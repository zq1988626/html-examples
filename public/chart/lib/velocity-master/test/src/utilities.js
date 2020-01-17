"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
exports.$ = (window.jQuery || window.Zepto), exports.$qunitStage = document.getElementById("qunit-stage"), exports.defaultStyles = {
    opacity: 1,
    width: 1,
    height: 1,
    marginBottom: 1,
    colorGreen: 200,
    textShadowBlur: 3,
}, exports.defaultProperties = {
    opacity: String(exports.defaultStyles.opacity / 2),
    width: exports.defaultStyles.width * 2 + "px",
    height: exports.defaultStyles.height * 2 + "px",
}, exports.defaultOptions = {
    queue: "",
    duration: 300,
    easing: "swing",
    begin: null,
    complete: null,
    progress: null,
    loop: false,
    delay: 0,
    mobileHA: true,
}, exports.asyncCheckDuration = exports.defaultOptions.duration / 2, exports.completeCheckDuration = exports.defaultOptions.duration * 2, exports.IE = (() => {
    if (document.documentMode) {
        return document.documentMode;
    }
    else {
        for (let i = 7; i > 0; i--) {
            let div = document.createElement("div");
            div.innerHTML = `<!${"--"}[if IE ${i}]><span></span><![endif]-->`;
            if (div.getElementsByTagName("span").length) {
                div = null;
                return i;
            }
            div = null;
        }
    }
    return undefined;
})();
const targets = [];
let asyncCount = 0;
QUnit.config.reorder = false;
function applyStartValues(element, startValues) {
    exports.$.each(startValues, (property, startValue) => {
        element.style[property] = startValue;
    });
}
exports.applyStartValues = applyStartValues;
function Data(element) {
    return (element.jquery ? element[0] : element).velocityData;
}
exports.Data = Data;
function getNow() {
    return performance && performance.now ? performance.now() : Date.now();
}
exports.getNow = getNow;
function getPropertyValue(element, property) {
    return velocity_animate_1.default(element, "style", property);
}
exports.getPropertyValue = getPropertyValue;
function getTarget(startValues) {
    const div = document.createElement("div");
    div.className = "target";
    div.style.opacity = String(exports.defaultStyles.opacity);
    div.style.color = `rgb(125, ${exports.defaultStyles.colorGreen}, 125)`;
    div.style.width = exports.defaultStyles.width + "px";
    div.style.height = exports.defaultStyles.height + "px";
    div.style.marginBottom = exports.defaultStyles.marginBottom + "px";
    div.style.textShadow = `0px 0px ${exports.defaultStyles.textShadowBlur}px red`;
    exports.$qunitStage.appendChild(div);
    targets.push(div);
    if (startValues) {
        applyStartValues(div, startValues);
    }
    return div;
}
exports.getTarget = getTarget;
function once(func) {
    let done, result;
    return function () {
        if (!done) {
            result = func.apply(this, arguments);
            func = done = true;
        }
        return result;
    };
}
exports.once = once;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function asyncTests(assert, count, callback) {
    if (!assert) {
        const oldCount = asyncCount;
        asyncCount = 0;
        return oldCount;
    }
    const done = assert.async(1);
    asyncCount += count;
    setTimeout(() => {
        callback(done);
    }, 1);
}
exports.asyncTests = asyncTests;
function isEmptyObject(variable) {
    for (const name in variable) {
        if (variable.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
QUnit.testDone(() => {
    try {
        document.querySelectorAll(".velocity-animating")
            .velocity("stop");
    }
    catch (_a) {
    }
    while (targets.length) {
        try {
            exports.$qunitStage.removeChild(targets.pop());
        }
        catch (_b) {
        }
    }
    asyncTests();
    velocity_animate_1.default.defaults.reset();
});
QUnit.done((details) => {
    console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
});
