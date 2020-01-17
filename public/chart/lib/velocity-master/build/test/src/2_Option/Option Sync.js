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
import { asyncTests, defaultProperties, getTarget, sleep } from "../utilities";
import "./_module";
QUnit.test("Sync", (assert) => {
    asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = getTarget(), $targetSet = [getTarget(), $target, getTarget()];
        let complete = false;
        Velocity($target, defaultProperties, {
            duration: 300,
            complete() {
                complete = true;
            },
        });
        Velocity($targetSet, defaultProperties, {
            sync: false,
            duration: 250,
        });
        yield sleep(275);
        assert.notOk(complete, "Sync 'false' animations don't wait for completion.");
        done();
    }));
    asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = getTarget(), $targetSet = [getTarget(), $target, getTarget()];
        let complete = false;
        Velocity($target, defaultProperties, {
            duration: 300,
            complete() {
                complete = true;
            },
        });
        Velocity($targetSet, defaultProperties, {
            sync: true,
            duration: 250,
            begin() {
                assert.ok(complete, "Sync 'true' animations wait for completion.");
                done();
            },
        });
    }));
    assert.expect(asyncTests());
});
//# sourceMappingURL=Option Sync.js.map