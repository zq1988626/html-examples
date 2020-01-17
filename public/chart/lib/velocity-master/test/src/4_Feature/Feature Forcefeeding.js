"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.todo("Forcefeeding", (assert) => {
    const testStartWidth = "1rem", testStartWidthToPx = "16px", testStartHeight = "10px", $target = utilities_1.getTarget();
    velocity_animate_1.default($target, {
        width: [100, "linear", testStartWidth],
        height: [100, testStartHeight],
        opacity: [utilities_1.defaultProperties.opacity, "easeInQuad"],
    });
    assert.equal(utilities_1.Data($target).cache.width, parseFloat(testStartWidthToPx), "Forcefed value #1 passed to tween.");
    assert.equal(utilities_1.Data($target).cache.height, parseFloat(testStartHeight), "Forcefed value #2 passed to tween.");
    assert.equal(utilities_1.Data($target).cache.opacity, utilities_1.defaultStyles.opacity, "Easing was misinterpreted as forcefed value.");
});
