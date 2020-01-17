"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("qunit");
const velocity_animate_1 = require("velocity-animate");
const utilities_1 = require("../utilities");
require("./_module");
QUnit.skip("Colors (Shorthands)", (assert) => {
    const $target = utilities_1.getTarget();
    velocity_animate_1.default($target, { borderColor: "#7871c2", color: ["#297dad", "spring", "#5ead29"] });
});
