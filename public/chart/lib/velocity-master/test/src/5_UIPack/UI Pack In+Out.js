"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.skip("In/Out", (assert) => {
    const done = assert.async(2), $target1 = utilities_1.getTarget(), $target2 = utilities_1.getTarget(), $target3 = utilities_1.getTarget(), $target4 = utilities_1.getTarget(), $target5 = utilities_1.getTarget(), $target6 = utilities_1.getTarget();
    velocity_animate_1.default($target1, "transition.bounceIn", utilities_1.defaultOptions.duration);
    assert.expect(8);
    setTimeout(() => {
        assert.notEqual(utilities_1.getPropertyValue($target3, "display"), 0, "Out: display not prematurely set to none.");
        assert.notEqual(utilities_1.getPropertyValue($target6, "visibility"), "hidden", "Out: visibility not prematurely set to hidden.");
        done();
    }, utilities_1.asyncCheckDuration);
    setTimeout(() => {
        assert.equal(utilities_1.getPropertyValue($target2, "display"), "inline", "In: Custom inline value set.");
        assert.equal(utilities_1.getPropertyValue($target3, "display"), 0, "Out: display set to none.");
        assert.equal(utilities_1.getPropertyValue($target5, "visibility"), "visible", "In: visibility set to visible.");
        assert.equal(utilities_1.getPropertyValue($target6, "visibility"), "hidden", "Out: visibility set to hidden.");
        done();
    }, utilities_1.completeCheckDuration);
});
