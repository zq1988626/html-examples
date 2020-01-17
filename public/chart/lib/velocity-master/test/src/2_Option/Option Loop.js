"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Loop", (assert) => {
    utilities_1.asyncTests(assert, 4, (done) => {
        const testOptions = { loop: 2, delay: 100, duration: 100 }, start = utilities_1.getNow();
        let begin = 0, complete = 0, loop = 0, lastPercentComplete = 2;
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            loop: testOptions.loop,
            delay: testOptions.delay,
            duration: testOptions.duration,
            begin() {
                begin++;
            },
            progress(elements, percentComplete) {
                if (lastPercentComplete > percentComplete) {
                    loop++;
                }
                lastPercentComplete = percentComplete;
            },
            complete() {
                complete++;
            },
        })
            .then(() => {
            assert.equal(begin, 1, "Begin callback only called once.");
            assert.equal(loop, testOptions.loop * 2 - 1, "Animation looped correct number of times (once each direction per loop).");
            assert.close(utilities_1.getNow() - start, (testOptions.delay + testOptions.duration) * loop, 32, "Looping with 'delay' has correct duration.");
            assert.equal(complete, 1, "Complete callback only called once.");
            done();
        });
    });
    assert.expect(utilities_1.asyncTests());
});
