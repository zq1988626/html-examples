"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Display", (assert) => {
    const done = assert.async(5);
    velocity_animate_1.default(utilities_1.getTarget(), "style", "display", "none")
        .velocity({ display: "block" }, {
        progress: utilities_1.once((elements) => {
            assert.equal(elements.velocity("style", "display"), "block", "Display:'block' was set immediately.");
            done();
        }),
    });
    velocity_animate_1.default(utilities_1.getTarget(), "style", "display", "none")
        .velocity("style", "display", "auto")
        .then((elements) => {
        assert.equal(elements[0].style.display, "block", "Display:'auto' was understood.");
        assert.equal(elements.velocity("style", "display"), "block", "Display:'auto' was cached as 'block'.");
        done();
    });
    velocity_animate_1.default(utilities_1.getTarget(), "style", "display", "none")
        .velocity("style", "display", "")
        .then((elements) => {
        assert.equal(elements.velocity("style", "display"), "block", "Display:'' was reset correctly.");
        done();
    });
    velocity_animate_1.default(utilities_1.getTarget(), { display: "none" }, {
        progress: utilities_1.once((elements) => {
            assert.notEqual(elements.velocity("style", "display"), "none", "Display:'none' was not set immediately.");
            done();
        }),
    })
        .then((elements) => {
        assert.equal(elements.velocity("style", "display"), "none", "Display:'none' was set upon completion.");
        done();
    });
});
