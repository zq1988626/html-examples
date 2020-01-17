"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "fadeOut", {
    "duration": 1000,
    "0%": {
        opacity: "1",
    },
    "100%": {
        opacity: "0",
    },
});
