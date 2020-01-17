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
QUnit.test("Unit Calculation", (assert) => {
    utilities_1.asyncTests(assert, 2, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { left: "500px" }, { duration: 10 });
        yield utilities_1.sleep(100);
        assert.equal(utilities_1.getPropertyValue($target, "left"), "500px", "Finished animated value with given pixels should be the same.");
        velocity_animate_1.default($target, { left: "0px" }, { duration: 10 });
        yield utilities_1.sleep(100);
        assert.equal(utilities_1.getPropertyValue($target, "left"), "0px", "Finished animated value with 0px should be the same.");
        done();
    }));
    utilities_1.asyncTests(assert, 1, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { left: "500px" }, { duration: 10 });
        yield utilities_1.sleep(100);
        velocity_animate_1.default($target, { left: 0 }, { duration: 10 });
        yield utilities_1.sleep(1000);
        assert.equal(utilities_1.getPropertyValue($target, "left"), "0px", "Finished animated value given as number 0 should be the same as 0px.");
        done();
    }));
    utilities_1.asyncTests(assert, 2, (done) => __awaiter(this, void 0, void 0, function* () {
        const $target = utilities_1.getTarget();
        velocity_animate_1.default($target, { left: 500 }, { duration: 10 });
        yield utilities_1.sleep(100);
        assert.equal(utilities_1.getPropertyValue($target, "left"), "500px", "Finished animated value with given pixels should be the same.");
        velocity_animate_1.default($target, { left: 0 }, { duration: 10 });
        yield utilities_1.sleep(100);
        assert.equal(utilities_1.getPropertyValue($target, "left"), "0px", "Omitted pixels (px) when given animation should run properly.");
        done();
    }));
});
