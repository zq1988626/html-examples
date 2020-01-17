"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../utility");
const velocityFn_1 = require("../velocityFn");
function patch(proto, global) {
    try {
        utility_1.defineProperty(proto, (global ? "V" : "v") + "elocity", velocityFn_1.Velocity);
    }
    catch (e) {
        console.warn(`VelocityJS: Error when trying to add prototype.`, e);
    }
}
exports.patch = patch;
