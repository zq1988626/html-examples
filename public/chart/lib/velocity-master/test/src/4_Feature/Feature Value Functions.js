"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.todo("Value Functions", (assert) => {
    const testWidth = 10, $target1 = utilities_1.getTarget(), $target2 = utilities_1.getTarget();
    velocity_animate_1.default([$target1, $target2], {
        width(i, total) {
            return (i + 1) / total * testWidth;
        },
    });
    assert.equal(utilities_1.Data($target1).cache.width, parseFloat(testWidth) / 2, "Function value #1 passed to tween.");
    assert.equal(utilities_1.Data($target2).cache.width, parseFloat(testWidth), "Function value #2 passed to tween.");
});
