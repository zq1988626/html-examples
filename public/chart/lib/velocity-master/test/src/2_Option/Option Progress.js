"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Progress", (assert) => {
    utilities_1.asyncTests(assert, 4, (done) => {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, utilities_1.defaultProperties, {
            duration: utilities_1.asyncCheckDuration,
            progress: utilities_1.once(function (elements, percentComplete, msRemaining) {
                assert.deepEqual(elements, [$target], "Elements passed into progress.");
                assert.deepEqual(this, [$target], "Elements passed into progress as this.");
                assert.equal(percentComplete >= 0 && percentComplete <= 1, true, "'percentComplete' passed into progress.");
                assert.equal(msRemaining > utilities_1.asyncCheckDuration - 50, true, "'msRemaining' passed into progress.");
                done();
            }),
        });
    });
    assert.expect(utilities_1.asyncTests());
});
