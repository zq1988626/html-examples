"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.skip("Callbacks", (assert) => {
    const done = assert.async(2), $targets = [utilities_1.getTarget(), utilities_1.getTarget()];
    assert.expect(3);
    velocity_animate_1.default($targets, "transition.bounceIn", {
        begin(elements) {
            assert.deepEqual(elements, $targets, "Begin callback returned.");
            done();
        },
        complete(elements) {
            assert.deepEqual(elements, $targets, "Complete callback returned.");
            done();
        },
    });
});
