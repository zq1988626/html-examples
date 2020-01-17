"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("End Value Setting", (assert) => {
    const done = assert.async(1);
    velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties)
        .then((elements) => {
        assert.equal(velocity_animate_1.default(elements[0], "style", "width"), utilities_1.defaultProperties.width, "Standard end value #1 was set.");
        assert.equal(velocity_animate_1.default(elements[0], "style", "opacity"), utilities_1.defaultProperties.opacity, "Standard end value #2 was set.");
        done();
    });
});
