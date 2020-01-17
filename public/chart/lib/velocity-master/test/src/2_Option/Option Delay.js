"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Delay", (assert) => {
    const testDelay = 250;
    utilities_1.asyncTests(assert, 1, (done) => {
        const start = utilities_1.getNow();
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration: utilities_1.defaultOptions.duration,
            delay: testDelay,
            begin(elements, activeCall) {
                assert.close(utilities_1.getNow() - start, testDelay, 32, "Delayed calls start after the correct delay.");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const start = utilities_1.getNow();
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration: utilities_1.defaultOptions.duration,
            delay: testDelay,
        })
            .velocity(utilities_1.defaultProperties, {
            duration: utilities_1.defaultOptions.duration,
            delay: testDelay,
            begin(elements, activeCall) {
                assert.close(utilities_1.getNow() - start, (testDelay * 2) + utilities_1.defaultOptions.duration, 32, "Chained delays start after the correct delay.");
                done();
            },
        });
    });
    assert.expect(utilities_1.asyncTests());
});
