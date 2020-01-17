"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Promises", (assert) => {
    const done = assert.async(10), start = utilities_1.getNow();
    let result;
    assert.expect(10);
    velocity_animate_1.default()
        .then(() => {
        assert.notOk(true, "Calling with no arguments should reject a Promise.");
    }, () => {
        assert.ok(true, "Calling with no arguments should reject a Promise.");
    })
        .then(done);
    velocity_animate_1.default(utilities_1.getTarget())
        .then(() => {
        assert.notOk(true, "Calling with no properties should reject a Promise.");
    }, () => {
        assert.ok(true, "Calling with no properties should reject a Promise.");
    })
        .then(done);
    velocity_animate_1.default(utilities_1.getTarget(), {})
        .then(() => {
        assert.ok(true, "Calling with empty properties should not reject a Promise.");
    }, () => {
        assert.notOk(true, "Calling with empty properties should not reject a Promise.");
    })
        .then(done);
    velocity_animate_1.default(utilities_1.getTarget(), {}, utilities_1.defaultOptions.duration)
        .then(() => {
        assert.ok(true, "Calling with empty properties + duration should not reject a Promise.");
    }, () => {
        assert.notOk(true, "Calling with empty properties + duration should not reject a Promise.");
    })
        .then(done);
    velocity_animate_1.default(utilities_1.getTarget(), {}, "fakeArg1", "fakeArg2")
        .then(() => {
        assert.ok(true, "Calling with invalid arguments should reject a Promise.");
    }, () => {
        assert.notOk(true, "Calling with invalid arguments should reject a Promise.");
    })
        .then(done);
    result = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, utilities_1.defaultOptions);
    result
        .then((elements) => {
        assert.equal(elements.length, 1, "Calling with a single element fulfills with a single element array.");
    }, () => {
        assert.ok(false, "Calling with a single element fulfills with a single element array.");
    })
        .then(done);
    result.velocity(utilities_1.defaultProperties)
        .then((elements) => {
        assert.ok(utilities_1.getNow() - start > 2 * utilities_1.defaultOptions.duration, "Queued call fulfilled after correct delay.");
    }, () => {
        assert.ok(false, "Queued call fulfilled after correct delay.");
    })
        .then(done);
    result = velocity_animate_1.default([utilities_1.getTarget(), utilities_1.getTarget()], utilities_1.defaultProperties, utilities_1.defaultOptions);
    result
        .then((elements) => {
        assert.equal(elements.length, 2, "Calling with multiple elements fulfills with a multiple element array.");
    }, () => {
        assert.ok(false, "Calling with multiple elements fulfills with a multiple element array.");
    })
        .then(done);
    const anim = velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, utilities_1.defaultOptions);
    anim
        .then(() => {
        assert.ok(utilities_1.getNow() - start < utilities_1.defaultOptions.duration, "Stop call fulfilled after correct delay.");
    }, () => {
        assert.ok(false, "Stop call fulfilled after correct delay.");
    })
        .then(done);
    anim.velocity("stop");
    Promise
        .all([
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, utilities_1.defaultOptions).promise,
        velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, utilities_1.defaultOptions).promise,
    ])
        .then(() => {
        assert.ok(true, "Promise.all fulfilled when all animations have finished.");
    })
        .then(done);
});
