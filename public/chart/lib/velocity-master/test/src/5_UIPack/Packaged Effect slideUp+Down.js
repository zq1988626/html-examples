"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.skip("Packaged Effect: slideUp/Down", (assert) => {
    const done = assert.async(4), $target1 = utilities_1.getTarget(), $target2 = utilities_1.getTarget(), initialStyles = {
        display: "none",
        paddingTop: "123px",
    };
    $target1.style.display = initialStyles.display;
    $target1.style.paddingTop = initialStyles.paddingTop;
    velocity_animate_1.default($target1, "slideDown", {
        begin(elements) {
            assert.deepEqual(elements, [$target1], "slideDown: Begin callback returned.");
            done();
        },
        complete(elements) {
            assert.deepEqual(elements, [$target1], "slideDown: Complete callback returned.");
            assert.notEqual(utilities_1.getPropertyValue($target1, "height"), 0, "slideDown: height set.");
            assert.equal(utilities_1.getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideDown: paddingTop set.");
            done();
        },
    });
    velocity_animate_1.default($target2, "slideUp", {
        begin(elements) {
            assert.deepEqual(elements, [$target2], "slideUp: Begin callback returned.");
            done();
        },
        complete(elements) {
            assert.deepEqual(elements, [$target2], "slideUp: Complete callback returned.");
            assert.equal(utilities_1.getPropertyValue($target2, "display"), 0, "slideUp: display set to none.");
            assert.notEqual(utilities_1.getPropertyValue($target2, "height"), 0, "slideUp: height reset.");
            assert.equal(utilities_1.getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideUp: paddingTop reset.");
            done();
        },
    });
});
