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
QUnit.test("Sync", (assert) => {
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget(), $targetSet = [utilities_1.getTarget(), $target, utilities_1.getTarget()];
        let complete = false;
        velocity_animate_1.default($target, utilities_1.defaultProperties, {
            duration: 300,
            complete() {
                complete = true;
            },
        });
        velocity_animate_1.default($targetSet, utilities_1.defaultProperties, {
            sync: false,
            duration: 250,
        });
        yield utilities_1.sleep(275);
        assert.notOk(complete, "Sync 'false' animations don't wait for completion.");
        done();
    }));
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget(), $targetSet = [utilities_1.getTarget(), $target, utilities_1.getTarget()];
        let complete = false;
        velocity_animate_1.default($target, utilities_1.defaultProperties, {
            duration: 300,
            complete() {
                complete = true;
            },
        });
        velocity_animate_1.default($targetSet, utilities_1.defaultProperties, {
            sync: true,
            duration: 250,
            begin() {
                assert.ok(complete, "Sync 'true' animations wait for completion.");
                done();
            },
        });
    }));
    assert.expect(utilities_1.asyncTests());
});
