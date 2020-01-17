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
import { defaultProperties, getTarget } from "../utilities";
import "./_module";
QUnit.test("FPS Limit", (assert) => __awaiter(this, void 0, void 0, function* () {
    let count;
    const $target = getTarget(), frameRates = [5, 15, 30, 60], testFrame = (frameRate) => {
        let counter = 0;
        Velocity.defaults.fpsLimit = frameRate;
        // Test if the frame rate is assigned succesfully.
        assert.equal(frameRate, Velocity.defaults.fpsLimit, "Setting global fps limit to " + frameRate);
        return Velocity($target, defaultProperties, {
            duration: 1000,
            progress() {
                counter++;
            },
        })
            .then(() => counter);
    };
    assert.expect(frameRates.length * 2);
    // Test if the limit is working for 60, 30, 15 and 5 fps.
    for (const frameRate of frameRates) {
        assert.ok((count = yield testFrame(frameRate)) <= frameRate + 1, `...counted ${count} frames (\xB11 frame)`);
    }
}));
//# sourceMappingURL=Option Fps Limit.js.map