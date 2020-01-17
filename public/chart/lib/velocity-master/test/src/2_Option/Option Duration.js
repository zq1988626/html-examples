"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Duration", (assert) => {
    const testDuration = velocity_animate_1.default.defaults.duration;
    utilities_1.asyncTests(assert, 1, (done) => {
        const start = utilities_1.getNow();
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration: testDuration,
            complete(elements, activeCall) {
                const time = utilities_1.getNow() - start;
                assert.close(time, testDuration, 32, `Calls run for the correct duration (~${Math.floor(time)}ms / ${testDuration}ms).`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const start = utilities_1.getNow();
        velocity_animate_1.default(utilities_1.getTarget(), { width: ["200px", "500px"] }, {
            duration: testDuration,
        })
            .velocity({ width: ["500px", "200px"] }, {
            duration: testDuration,
            complete(elements, activeCall) {
                const time = utilities_1.getNow() - start;
                assert.close(utilities_1.getNow() - start, testDuration * 2, 32, `Chained durations run for the correct duration (~${Math.floor(time)}ms / ${testDuration * 2}ms).`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const start = utilities_1.getNow();
        velocity_animate_1.default(utilities_1.getTarget(), { width: ["200px", "500px"] })
            .velocity({ width: ["500px", "200px"] })
            .then(() => {
            const time = utilities_1.getNow() - start;
            assert.close(utilities_1.getNow() - start, testDuration * 2, 32, `Chained durations with defaults run for the correct duration (~${Math.floor(time)}ms / ${testDuration * 2}ms).`);
            done();
        });
    });
    assert.expect(utilities_1.asyncTests());
});
