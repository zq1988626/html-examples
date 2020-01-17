"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Repeat", (assert) => {
    utilities_1.asyncTests(assert, 4, (done) => {
        const testOptions = { repeat: 2, delay: 100, duration: 100 }, start = Date.now();
        let begin = 0, complete = 0, repeat = 0;
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            repeat: testOptions.repeat,
            delay: testOptions.delay,
            duration: testOptions.duration,
            begin() {
                begin++;
            },
            progress(elements, percentComplete) {
                if (percentComplete === 1) {
                    repeat++;
                }
            },
            complete() {
                complete++;
                assert.equal(begin, 1, "Begin callback only called once.");
                assert.equal(repeat, testOptions.repeat + 1, "Animation repeated correct number of times (original plus repeats).");
                assert.close(Date.now() - start, (testOptions.delay + testOptions.duration) * (testOptions.repeat + 1), (testOptions.repeat + 1) * 16 + 32, "Repeat with 'delay' has correct duration.");
                assert.equal(complete, 1, "Complete callback only called once.");
                done();
            },
        });
    });
    assert.expect(utilities_1.asyncTests());
});
