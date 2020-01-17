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
QUnit.test("FPS Limit", (assert) => __awaiter(this, void 0, void 0, function* () {
    let count;
    const $target = utilities_1.getTarget(), frameRates = [5, 15, 30, 60], testFrame = (frameRate) => {
        let counter = 0;
        velocity_animate_1.default.defaults.fpsLimit = frameRate;
        assert.equal(frameRate, velocity_animate_1.default.defaults.fpsLimit, "Setting global fps limit to " + frameRate);
        return velocity_animate_1.default($target, utilities_1.defaultProperties, {
            duration: 1000,
            progress() {
                counter++;
            },
        })
            .then(() => counter);
    };
    assert.expect(frameRates.length * 2);
    for (const frameRate of frameRates) {
        assert.ok((count = yield testFrame(frameRate)) <= frameRate + 1, `...counted ${count} frames (\xB11 frame)`);
    }
}));
