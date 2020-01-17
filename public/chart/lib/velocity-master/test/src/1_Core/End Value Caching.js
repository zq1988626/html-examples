"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("End Value Caching", (assert) => {
    const done = assert.async(2), newProperties = { height: "50px", width: "250px" };
    assert.expect(4);
    velocity_animate_1.default(utilities_1.getTarget(newProperties), utilities_1.defaultProperties)
        .then((elements) => {
        assert.equal(utilities_1.Data(elements[0]).cache.width, utilities_1.defaultProperties.width, "Stale end value #1 wasn't pulled.");
        assert.equal(utilities_1.Data(elements[0]).cache.height, utilities_1.defaultProperties.height, "Stale end value #2 wasn't pulled.");
        done();
    });
    velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties)
        .velocity(newProperties)
        .then((elements) => {
        assert.equal(utilities_1.Data(elements[0]).cache.width, newProperties.width, "Chained end value #1 was pulled.");
        assert.equal(utilities_1.Data(elements[0]).cache.height, newProperties.height, "Chained end value #2 was pulled.");
        done();
    });
});
