"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Speed", (assert) => {
    const delay = 200, duration = 400, startDelay = utilities_1.getNow();
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default.defaults.speed = 3;
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            speed: 5,
            begin(elements) {
                assert.equal(elements.velocity.animations[0].options.speed, 5, "Speed on options overrides default.");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration,
            begin(elements) {
                elements.__start = utilities_1.getNow();
            },
            complete(elements) {
                const actual = utilities_1.getNow() - elements.__start, expected = duration / 3;
                assert.close(actual, expected, 32, `Velocity.defaults.speed change is respected. (\xD73, ${Math.floor(actual - expected)}ms \xB132ms)`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration,
            speed: 2,
            begin(elements) {
                elements.__start = utilities_1.getNow();
            },
            complete(elements) {
                const actual = utilities_1.getNow() - elements.__start, expected = duration / 2;
                assert.close(actual, expected, 32, `Double speed animation lasts half as long. (\xD72, ${Math.floor(actual - expected)}ms \xB132ms)`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration,
            delay,
            speed: 2,
            begin(elements) {
                elements.__start = startDelay;
            },
            complete(elements) {
                const actual = utilities_1.getNow() - elements.__start, expected = (duration + delay) / 2;
                assert.close(actual, expected, 32, `Delayed animation includes speed for delay. (\xD72, ${Math.floor(actual - expected)}ms \xB132ms)`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration,
            delay: -delay,
            speed: 2,
            begin(elements) {
                elements.__start = startDelay;
            },
            complete(elements) {
                const actual = utilities_1.getNow() - elements.__start, expected = (duration - delay) / 2;
                assert.close(actual, expected, 32, `Negative delay animation includes speed for delay. (\xD72, ${Math.floor(actual - expected)}ms \xB132ms)`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration,
            speed: 0.5,
            begin(elements) {
                elements.__start = utilities_1.getNow();
            },
            complete(elements) {
                const actual = utilities_1.getNow() - elements.__start, expected = duration * 2;
                assert.close(actual, expected, 64, `Half speed animation lasts twice as long. (\xD7\xBD, ${Math.floor(actual - expected)}ms \xB164ms)`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration,
            speed: 0,
            progress(elements, percentComplete) {
                if (!elements.__count) {
                    elements.__start = percentComplete;
                    elements.__count = 1;
                }
                else {
                    assert.equal(elements.__start, percentComplete, "Frozen (speed:0) animation doesn't progress.");
                    elements
                        .velocity("option", "speed", 1)
                        .velocity("stop");
                    done();
                }
            },
        });
    });
    assert.expect(utilities_1.asyncTests());
});
