"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.test("Pause + Resume", (assert) => __awaiter(this, void 0, void 0, function* () {
    utilities_1.asyncTests(assert, 2, (done) => {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, "pause");
        assert.ok(true, "Calling \"pause\" on an element that isn't animating doesn't cause an error.");
        velocity_animate_1.default($target, "resume");
        assert.ok(true, "Calling \"resume\" on an element that isn't animating doesn't cause an error.");
        done();
    });
    utilities_1.asyncTests(assert, 4, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        let progress = false;
        velocity_animate_1.default($target, { opacity: 0 }, {
            duration: 250,
            progress() {
                progress = true;
            },
        });
        velocity_animate_1.default($target, "pause");
        yield utilities_1.sleep(50);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "1", "Property value unchanged after pause.");
        assert.notOk(progress, "Progress callback not run during pause.");
        velocity_animate_1.default($target, "resume");
        yield utilities_1.sleep(300);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "0", "Tween completed after pause/resume.");
        assert.ok(progress, "Progress callback run after pause.");
        done();
    }));
    utilities_1.asyncTests(assert, 3, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { opacity: 0 }, { duration: 250, delay: 250 });
        velocity_animate_1.default($target, "pause");
        yield utilities_1.sleep(500);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "1", "Delayed property value unchanged after pause.");
        velocity_animate_1.default($target, "resume");
        yield utilities_1.sleep(100);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "1", "Delayed tween did not start early after pause.");
        yield utilities_1.sleep(500);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "0", "Delayed tween completed after pause/resume.");
        done();
    }));
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { opacity: 0 }, { queue: "test", duration: 250 });
        velocity_animate_1.default("pause", "test");
        yield utilities_1.sleep(300);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "1", "Pause 'queue' works globally.");
        done();
    }));
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { opacity: 0 })
            .velocity("pause");
        yield utilities_1.sleep(300);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "1", "Chained pause only pauses chained tweens.");
        done();
    }));
    assert.expect(utilities_1.asyncTests());
}));
