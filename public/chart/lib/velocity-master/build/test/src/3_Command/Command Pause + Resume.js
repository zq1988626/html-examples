/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "qunit";
import Velocity from "velocity-animate";
import { asyncTests, getPropertyValue, getTarget, sleep } from "../utilities";
import "./_module";
QUnit.test("Pause + Resume", (assert) => __awaiter(this, void 0, void 0, function* () {
    asyncTests(assert, 2, (done) => {
        const $target = getTarget();
        Velocity($target, "pause");
        assert.ok(true, "Calling \"pause\" on an element that isn't animating doesn't cause an error.");
        Velocity($target, "resume");
        assert.ok(true, "Calling \"resume\" on an element that isn't animating doesn't cause an error.");
        done();
    });
    asyncTests(assert, 4, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = getTarget();
        let progress = false;
        Velocity($target, { opacity: 0 }, {
            duration: 250,
            progress() {
                progress = true;
            },
        });
        Velocity($target, "pause");
        yield sleep(50);
        assert.equal(getPropertyValue($target, "opacity"), "1", "Property value unchanged after pause.");
        assert.notOk(progress, "Progress callback not run during pause.");
        Velocity($target, "resume");
        yield sleep(300);
        assert.equal(getPropertyValue($target, "opacity"), "0", "Tween completed after pause/resume.");
        assert.ok(progress, "Progress callback run after pause.");
        done();
    }));
    asyncTests(assert, 3, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = getTarget();
        Velocity($target, { opacity: 0 }, { duration: 250, delay: 250 });
        Velocity($target, "pause");
        yield sleep(500);
        assert.equal(getPropertyValue($target, "opacity"), "1", "Delayed property value unchanged after pause.");
        Velocity($target, "resume");
        yield sleep(100);
        assert.equal(getPropertyValue($target, "opacity"), "1", "Delayed tween did not start early after pause.");
        yield sleep(500);
        assert.equal(getPropertyValue($target, "opacity"), "0", "Delayed tween completed after pause/resume.");
        done();
    }));
    asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = getTarget();
        Velocity($target, { opacity: 0 }, { queue: "test", duration: 250 });
        Velocity("pause", "test");
        yield sleep(300);
        assert.equal(getPropertyValue($target, "opacity"), "1", "Pause 'queue' works globally.");
        done();
    }));
    asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = getTarget();
        Velocity($target, { opacity: 0 })
            .velocity("pause");
        yield sleep(300);
        assert.equal(getPropertyValue($target, "opacity"), "1", "Chained pause only pauses chained tweens.");
        done();
    }));
    // TODO: Better global tests, queue: false, named queues
    //	/* Ensure proper behavior with queue:false  */
    //	var $target4 = getTarget();
    //	Velocity($target4, {opacity: 0}, {duration: 200});
    //
    //	var isResumed = false;
    //
    //	await sleep(100);
    //	Velocity($target4, "pause");
    //	Velocity($target4, {left: -20}, {
    //		duration: 100,
    //		easing: "linear",
    //		queue: false,
    //		begin: function(elements) {
    //			assert.ok(true, "Animation with {queue:false} will run regardless of previously paused animations.");
    //		}
    //	});
    //
    //	Velocity($target4, {top: 20}, {
    //		duration: 100,
    //		easing: "linear",
    //		begin: function(elements) {
    //			assert.ok(isResumed, "Queued animation began after previously paused animation completed");
    //		}
    //	});
    //
    //	await sleep(100);
    //
    //	isResumed = true;
    //	Velocity($target4, "resume");
    //	await sleep(100);
    assert.expect(asyncTests());
}));
//# sourceMappingURL=Command Pause + Resume.js.map