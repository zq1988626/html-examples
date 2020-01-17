"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Arguments", (assert) => {
    const testComplete = () => {
    }, testDuration = 1000, testEasing = "easeInSine", testOptions = {
        duration: 123,
        easing: testEasing,
        complete: testComplete,
    };
    let result;
    assert.expect(18);
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties);
    assert.ok(result.length, "Overload variation #1a: Velocity(ELEMENT, {properties})");
    assert.ok(result.velocity.animations.length, "Overload variation #1b: Velocity(element, {PROPERTIES})");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testDuration);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #2a: Velocity(element, {properties}, DURATION<number>)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, "slow");
    assert.equal(result.velocity.animations[0].options.duration, 600, "Overload variation #2b: Velocity(element, {properties}, DURATION<slow>)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, "normal");
    assert.equal(result.velocity.animations[0].options.duration, 400, "Overload variation #2c: Velocity(element, {properties}, DURATION<normal>)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, "fast");
    assert.equal(result.velocity.animations[0].options.duration, 200, "Overload variation #2d: Velocity(element, {properties}, DURATION<fast>)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testEasing);
    assert.equal(typeof result.velocity.animations[0].options.easing, "function", "Overload variation #3: Velocity(element, {properties}, EASING)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testComplete);
    assert.equal(typeof result.velocity.animations[0].options.complete, "function", "Overload variation #4: Velocity(element, {properties}, COMPLETE)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testDuration, [0.42, 0, 0.58, 1]);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #5a: Velocity(element, {properties}, DURATION, easing)");
    assert.equal(result.velocity.animations[0].options.easing(0.2, 0, 1), 0.0816598562658975, "Overload variation #5b: Velocity(element, {properties}, duration, EASING)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testDuration, testComplete);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #6a: Velocity(element, {properties}, DURATION, complete)");
    assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #6b: Velocity(element, {properties}, duration, COMPLETE)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testDuration, testEasing, testComplete);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #7a: Velocity(element, {properties}, DURATION, easing, complete)");
    assert.equal(typeof result.velocity.animations[0].options.easing, "function", "Overload variation #7b: Velocity(element, {properties}, duration, EASING, complete)");
    assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #7c: Velocity(element, {properties}, duration, easing, COMPLETE)");
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, testOptions);
    assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #8: Velocity(element, {properties}, {OPTIONS})");
    velocity_animate_1.default({ elements: [utilities_1.getTarget()], properties: utilities_1.defaultProperties, options: testOptions });
    assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #9: Velocity({elements:[elements], properties:{properties}, options:{OPTIONS})");
    velocity_animate_1.default({ elements: [utilities_1.getTarget()], properties: "stop", options: testOptions });
    assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #10: Velocity({elements:[elements], properties:\"ACTION\", options:{OPTIONS})");
});
