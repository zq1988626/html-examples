"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Easing", (assert) => {
    utilities_1.asyncTests(assert, 1, (done) => {
        let success = false;
        try {
            success = true;
            velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, { easing: "fake" });
        }
        catch (e) {
            success = false;
        }
        assert.ok(success, "Fake easing string didn't throw error.");
        done();
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        let success = false;
        try {
            success = true;
            velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, { easing: ["a", 0.5, 0.5, 0.5] });
            velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, { easing: [0.5, 0.5, 0.5] });
        }
        catch (e) {
            success = false;
        }
        assert.ok(success, "Invalid bezier curve didn't throw error.");
        done();
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const easingBezierArray = [0.27, -0.65, 0.78, 0.19], easingBezierTestPercent = 0.25, easingBezierTestValue = -0.23;
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            easing: easingBezierArray,
            begin(elements, animation) {
                assert.close(animation.options.easing(easingBezierTestPercent, 0, 1), easingBezierTestValue, 0.005, "Array converted into bezier function.");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const easingSpringRK4Array = [250, 12], easingSpringRK4TestPercent = 0.25, easingSpringRK4TestValue = 0.928, easingSpringRK4TestDuration = 992;
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            duration: 150,
            easing: easingSpringRK4Array,
            begin(elements, animation) {
                assert.close(animation.options.easing(easingSpringRK4TestPercent, 0, 1), easingSpringRK4TestValue, 10, "Array with duration converted into springRK4 function.");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const easingStepArray = [4], easingStepTestPercent = 0.35, easingStepTestValue = 0.25;
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
            easing: easingStepArray,
            begin(elements, animation) {
                assert.close(animation.options.easing(easingStepTestPercent, 0, 1), easingStepTestValue, 0.05, "Array converted into Step function.");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 3, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), { opacity: [0, "during", 1] }, {
            duration: utilities_1.asyncCheckDuration,
            begin(elements) {
                assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'during').");
            },
            progress: utilities_1.once((elements) => {
                assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'during').");
            }),
            complete(elements) {
                assert.equal(elements.velocity("style", "opacity"), 1, "Correct complete value (easing:'during').");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 3, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), { opacity: [0, "at-start", 1] }, {
            duration: utilities_1.asyncCheckDuration,
            begin(elements) {
                assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-start').");
            },
            progress: utilities_1.once((elements) => {
                assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'at-start').");
            }),
            complete(elements) {
                assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-start').");
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 3, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), { opacity: [0, "at-end", 1] }, {
            duration: utilities_1.asyncCheckDuration,
            begin(elements) {
                assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-end').");
            },
            progress: utilities_1.once((elements) => {
                assert.equal(elements.velocity("style", "opacity"), 1, "Correct progress value (easing:'at-end').");
            }),
            complete(elements) {
                assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-end').");
                done();
            },
        });
    });
    assert.expect(utilities_1.asyncTests());
});
