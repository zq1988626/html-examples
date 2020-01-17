"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "fadeIn", {
    "duration": 1000,
    "0%": {
        opacity: "0",
    },
    "100%": {
        opacity: "1",
    },
});
