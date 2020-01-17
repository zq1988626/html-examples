"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("'velocity-animating' Classname", (assert) => {
    const done = assert.async(1);
    velocity_animate_1.default(utilities_1.getTarget(), utilities_1.defaultProperties, {
        begin(elements) {
            assert.equal(/velocity-animating/.test(elements[0].className), true, "Class added.");
        },
        complete(elements) {
            assert.equal(/velocity-animating/.test(elements[0].className), false, "Class removed.");
        },
    })
        .then(done);
});
