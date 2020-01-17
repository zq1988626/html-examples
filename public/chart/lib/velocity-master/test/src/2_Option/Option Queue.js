"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Queue", (assert) => {
    const done = assert.async(4), testQueue = "custom", $target = utilities_1.getTarget(), ignore = $target.velocity("style", "display"), data = utilities_1.Data($target);
    let anim1, anim2, anim3;
    assert.expect(7);
    assert.ok(data.queueList[testQueue] === undefined, "Custom queue is empty.");
    $target.velocity(utilities_1.defaultProperties, {
        queue: testQueue,
        begin() {
            anim1 = true;
        },
        complete() {
            anim1 = false;
            assert.ok(!anim2, "Queued animation isn't started early.");
            done();
        },
    });
    assert.ok(data.queueList[testQueue] !== undefined, "Custom queue was created.");
    $target.velocity(utilities_1.defaultProperties, {
        queue: testQueue,
        begin() {
            anim2 = true;
            assert.ok(anim1 === false, "Queued animation starts after first.");
            done();
        },
        complete() {
            anim2 = false;
        },
    });
    assert.ok(data.queueList[testQueue], "Custom queue grows.");
    $target.velocity(utilities_1.defaultProperties, {
        begin() {
            anim3 = true;
            assert.ok(anim1 === true, "Different queue animation starts in parallel.");
            done();
        },
        complete() {
            anim3 = false;
        },
    });
    $target.velocity(utilities_1.defaultProperties, {
        queue: false,
        begin() {
            assert.ok(anim1 === true, "Queue:false animation starts in parallel.");
            done();
        },
    });
});
