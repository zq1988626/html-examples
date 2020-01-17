"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Reverse", (assert) => {
    const $target = utilities_1.getTarget(), opacity = $target.velocity("style", "opacity"), width = $target.velocity("style", "width") === "0" ? "0px" : $target.velocity("style", "width");
    utilities_1.asyncTests(assert, 2, (done) => {
        velocity_animate_1.default($target, utilities_1.defaultProperties, {
            complete(elements) {
                assert.equal(elements[0].velocity("style", "opacity"), utilities_1.defaultProperties.opacity, `Initial property #1 set correctly. (${utilities_1.defaultProperties.opacity})`);
                assert.equal(elements[0].velocity("style", "width"), utilities_1.defaultProperties.width, `Initial property #2 set correctly. (${utilities_1.defaultProperties.width})`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 2, (done) => {
        velocity_animate_1.default($target, "reverse", {
            complete(elements) {
                assert.equal(elements[0].velocity("style", "opacity"), opacity, `Reversed property #1 set correctly. (${opacity})`);
                assert.equal(elements[0].velocity("style", "width"), width, `Reversed property #2 set correctly. (${width})`);
                done();
            },
        });
    });
    utilities_1.asyncTests(assert, 2, (done) => {
        velocity_animate_1.default($target, "reverse", {
            complete(elements) {
                assert.equal(elements[0].velocity("style", "opacity"), utilities_1.defaultProperties.opacity, `Chained reversed property #1 set correctly. (${utilities_1.defaultProperties.opacity})`);
                assert.equal(elements[0].velocity("style", "width"), utilities_1.defaultProperties.width, `Chained reversed property #2 set correctly. (${utilities_1.defaultProperties.width})`);
                done();
            },
        });
    });
    assert.expect(utilities_1.asyncTests());
});
