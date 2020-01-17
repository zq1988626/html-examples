"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.skip("Call Options", (assert) => {
    const done = assert.async(2), UICallOptions1 = {
        delay: 123,
        duration: utilities_1.defaultOptions.duration,
        easing: "spring",
    }, $target1 = utilities_1.getTarget();
    velocity_animate_1.default($target1, "transition.slideLeftIn", UICallOptions1);
    setTimeout(() => {
        done();
    }, utilities_1.completeCheckDuration);
    const UICallOptions2 = {
        stagger: 100,
        duration: utilities_1.defaultOptions.duration,
        backwards: true,
    };
    const $targets = [utilities_1.getTarget(), utilities_1.getTarget(), utilities_1.getTarget()];
    velocity_animate_1.default($targets, "transition.slideLeftIn", UICallOptions2);
    setTimeout(() => {
        done();
    }, utilities_1.completeCheckDuration);
});
