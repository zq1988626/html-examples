"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.todo("Start Value Calculation", (assert) => {
    const testStartValues = {
        paddingLeft: "10px",
        height: "100px",
        paddingRight: "50%",
        marginLeft: "100px",
        marginBottom: "33%",
        marginTop: "100px",
        lineHeight: "30px",
        wordSpacing: "40px",
        backgroundColor: "rgb(123,0,0)",
    };
    const $target1 = utilities_1.getTarget();
    velocity_animate_1.default($target1, testStartValues);
    assert.equal(utilities_1.Data($target1).cache.paddingLeft, testStartValues.paddingLeft, "Undefined standard start value was calculated.");
    assert.equal(utilities_1.Data($target1).cache.backgroundColor, testStartValues.backgroundColor, "Undefined start value hook was calculated.");
    const $target2 = utilities_1.getTarget();
    velocity_animate_1.default($target2, utilities_1.defaultProperties);
    assert.equal(utilities_1.Data($target2).cache.width, parseFloat(utilities_1.defaultStyles.width), "Defined start value #1 was calculated.");
    assert.equal(utilities_1.Data($target2).cache.opacity, parseFloat(utilities_1.defaultStyles.opacity), "Defined start value #2 was calculated.");
    assert.equal(utilities_1.Data($target2).cache.color, parseFloat(utilities_1.defaultStyles.colorGreen), "Defined hooked start value was calculated.");
    const testPropertiesEndNoConvert = { paddingLeft: "20px", height: "40px", paddingRight: "75%" }, $target3 = utilities_1.getTarget();
    utilities_1.applyStartValues($target3, testStartValues);
    velocity_animate_1.default($target3, testPropertiesEndNoConvert);
    assert.equal(utilities_1.Data($target3).cache.paddingLeft, parseFloat(testStartValues.paddingLeft), "Start value #1 wasn't unit converted.");
    assert.equal(utilities_1.Data($target3).cache.height, parseFloat(testStartValues.height), "Start value #2 wasn't unit converted.");
    const testPropertiesEndConvert = { paddingLeft: "20%", height: "40%", lineHeight: "0.5em", wordSpacing: "2rem", marginLeft: "10vw", marginTop: "5vh", marginBottom: "100px" }, parentWidth = utilities_1.$qunitStage.clientWidth, parentHeight = utilities_1.$qunitStage.clientHeight, parentFontSize = velocity_animate_1.default(utilities_1.$qunitStage, "style", "fontSize"), remSize = parseFloat(velocity_animate_1.default(document.body, "style", "fontSize")), $target4 = utilities_1.getTarget();
    utilities_1.applyStartValues($target4, testStartValues);
    velocity_animate_1.default($target4, testPropertiesEndConvert);
    assert.equal(parseInt(utilities_1.Data($target4).cache.height, 10), Math.floor((parseFloat(testStartValues.height) / parentHeight) * 100), "Vertical property converted to %.");
    assert.equal(parseInt(utilities_1.Data($target4).cache.marginBottom, 10), parseFloat(testStartValues.marginBottom) / 100 * parseFloat($target4.parentElement.offsetWidth), "Property converted to px.");
    const testPropertiesTRBL = { left: "1000px" }, $TRBLContainer = document.createElement("div");
    $TRBLContainer.setAttribute("id", "TRBLContainer");
    $TRBLContainer.style.marginLeft = testPropertiesTRBL.left;
    $TRBLContainer.style.width = "100px";
    $TRBLContainer.style.height = "100px";
    document.body.appendChild($TRBLContainer);
    const $target5 = utilities_1.getTarget();
    $target5.style.position = "absolute";
    $TRBLContainer.appendChild($target5);
    velocity_animate_1.default($target5, testPropertiesTRBL);
    assert.equal(parseInt(utilities_1.Data($target5).cache.left, 10), Math.round(parseFloat(testPropertiesTRBL.left) + parseFloat(velocity_animate_1.default(document.body, "style", "marginLeft"))), "TRBL value was deferred to jQuery.");
});
