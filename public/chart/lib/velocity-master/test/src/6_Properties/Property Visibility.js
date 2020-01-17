"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Visibility", (assert) => {
    const done = assert.async(4);
    velocity_animate_1.default(utilities_1.getTarget(), "style", "visibility", "hidden")
        .velocity({ visibility: "visible" }, {
        progress: utilities_1.once((elements) => {
            assert.equal(elements.velocity("style", "visibility"), "visible", "Visibility:'visible' was set immediately.");
            done();
        }),
    });
    velocity_animate_1.default(utilities_1.getTarget(), "style", "visibility", "hidden")
        .velocity("style", "visibility", "")
        .then((elements) => {
        assert.equal(elements.velocity("style", "visibility"), "hidden", "Visibility:'' was reset correctly.");
        done();
    });
    velocity_animate_1.default(utilities_1.getTarget(), { visibility: "hidden" }, {
        progress: utilities_1.once((elements) => {
            assert.notEqual(elements.velocity("style", "visibility"), "visible", "Visibility:'hidden' was not set immediately.");
            done();
        }),
    })
        .then((elements) => {
        assert.equal(elements.velocity("style", "visibility"), "hidden", "Visibility:'hidden' was set upon completion.");
        done();
    });
});
