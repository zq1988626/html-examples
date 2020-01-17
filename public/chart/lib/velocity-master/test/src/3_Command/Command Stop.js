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
QUnit.test("Stop", (assert) => __awaiter(this, void 0, void 0, function* () {
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), "stop");
        assert.ok(true, "Calling on an element that isn't animating doesn't cause an error.");
        done();
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, utilities_1.defaultProperties, utilities_1.defaultOptions);
        velocity_animate_1.default($target, { top: 0 }, utilities_1.defaultOptions);
        velocity_animate_1.default($target, { width: 0 }, utilities_1.defaultOptions);
        velocity_animate_1.default($target, "stop");
        assert.ok(true, "Calling on an element that is animating doesn't cause an error.");
        done();
    });
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget(), startOpacity = utilities_1.getPropertyValue($target, "opacity");
        velocity_animate_1.default($target, { opacity: [0, 1] }, utilities_1.defaultOptions);
        yield utilities_1.sleep(utilities_1.defaultOptions.duration / 2);
        velocity_animate_1.default($target, "stop");
        assert.close(parseFloat(utilities_1.getPropertyValue($target, "opacity")), parseFloat(startOpacity) / 2, 0.1, "Animation runs until stopped.");
        done();
    }));
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        let begin = false;
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            delay: 1000,
            begin() {
                begin = true;
            },
        });
        yield utilities_1.sleep(500);
        velocity_animate_1.default($target, "stop");
        assert.notOk(begin, "Stop animation before delay ends.");
        done();
    }));
    utilities_1.asyncTests(assert, 2, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        let complete1 = false, complete2 = false;
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            queue: "test1",
            complete() {
                complete1 = true;
            },
        });
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            queue: "test2",
            complete() {
                complete2 = true;
            },
        });
        velocity_animate_1.default($target, "stop", "test1");
        yield utilities_1.sleep(utilities_1.defaultOptions.duration * 2);
        assert.ok(complete2, "Stop animation with correct queue.");
        assert.notOk(complete1, "Don't stop animation with wrong queue.");
        done();
    }));
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        let begin1 = false, begin2 = false;
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            begin() {
                begin1 = true;
            },
        });
        velocity_animate_1.default($target, { width: "500px" }, {
            begin() {
                begin2 = true;
            },
        });
        velocity_animate_1.default($target, "stop", true);
        yield utilities_1.sleep(utilities_1.defaultOptions.duration * 2);
        assert.notOk(begin1 || begin2, "Stop 'true' stops all animations.");
        done();
    }));
    utilities_1.asyncTests(assert, 2, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget(), anim = velocity_animate_1.default($target, { opacity: [0, 1] }, {
            queue: "test",
            begin() {
                begin1 = true;
            },
        });
        let begin1 = false, begin2 = false;
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            begin() {
                begin2 = true;
            },
        });
        anim.velocity("stop");
        yield utilities_1.sleep(utilities_1.defaultOptions.duration * 2);
        assert.notOk(begin1, "Stop without arguments on a chain stops chain animations.");
        assert.ok(begin2, "Stop without arguments on a chain doesn't stop other animations.");
        done();
    }));
    assert.expect(utilities_1.asyncTests());
}));
