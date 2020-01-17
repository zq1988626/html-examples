"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Complete", (assert) => {
    utilities_1.asyncTests(assert, 1, (done) => {
        const $targetSet = [utilities_1.getTarget(), utilities_1.getTarget()];
        velocity_animate_1.default($targetSet, utilities_1.defaultProperties, {
            duration: utilities_1.asyncCheckDuration,
            complete(elements) {
                assert.deepEqual(elements, $targetSet, "Elements passed into callback.");
                done();
            },
        });
    });
    assert.expect(utilities_1.asyncTests());
});
