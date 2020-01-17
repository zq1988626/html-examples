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
QUnit.test("Finish", (assert) => __awaiter(this, void 0, void 0, function* () {
    utilities_1.asyncTests(assert, 1, (done) => {
        velocity_animate_1.default(utilities_1.getTarget(), "finish");
        assert.ok(true, "Calling on an element that isn't animating doesn't cause an error.");
        done();
    });
    utilities_1.asyncTests(assert, 1, (done) => {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, utilities_1.defaultProperties, utilities_1.defaultOptions);
        velocity_animate_1.default($target, { top: 0 }, utilities_1.defaultOptions);
        velocity_animate_1.default($target, { width: 0 }, utilities_1.defaultOptions);
        velocity_animate_1.default($target, "finish");
        assert.ok(true, "Calling on an element that is animating doesn't cause an error.");
        done();
    });
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
        velocity_animate_1.default($target, "finish", "test1");
        yield utilities_1.sleep(utilities_1.defaultOptions.duration / 2);
        assert.ok(complete1, "Finish animation with correct queue.");
        assert.notOk(complete2, "Don't finish animation with wrong queue.");
        done();
    }));
    utilities_1.asyncTests(assert, 3, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        let begin = false, complete = false;
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            begin() {
                begin = true;
            },
            complete() {
                complete = true;
            },
        });
        yield utilities_1.sleep(500);
        velocity_animate_1.default($target, "finish");
        assert.ok(begin, "Finish calls 'begin()' callback without delay.");
        assert.ok(complete, "Finish calls 'complete()' callback without delay.");
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "0", "Finish animation with correct value.");
        done();
    }));
    utilities_1.asyncTests(assert, 3, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        let begin = false, complete = false;
        velocity_animate_1.default($target, { opacity: [0, 1] }, {
            delay: 1000,
            begin() {
                begin = true;
            },
            complete() {
                complete = true;
            },
        });
        yield utilities_1.sleep(500);
        velocity_animate_1.default($target, "finish");
        assert.ok(begin, "Finish calls 'begin()' callback with delay.");
        assert.ok(complete, "Finish calls 'complete()' callback with delay.");
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "0", "Finish animation with correct value before delay ends.");
        done();
    }));
    utilities_1.asyncTests(assert, 3, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { opacity: 0 })
            .velocity({ opacity: 1 })
            .velocity({ opacity: 0.25 })
            .velocity({ opacity: 0.75 })
            .velocity({ opacity: 0.5 });
        velocity_animate_1.default($target, "finish");
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "0", "Finish once starts the second animation.");
        velocity_animate_1.default($target, "finish");
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "1", "Finish twice starts the third animation.");
        velocity_animate_1.default($target, "finish", true);
        assert.equal(utilities_1.getPropertyValue($target, "opacity"), "0.5", "Finish 'true' finishes all animations.");
        done();
    }));
    assert.expect(utilities_1.asyncTests());
}));
