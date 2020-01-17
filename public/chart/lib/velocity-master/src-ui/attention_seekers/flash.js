"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "flash", {
    "duration": 1000,
    "0%,50%,100%": {
        opacity: "1",
    },
    "25%,75%": {
        opacity: "0",
    },
});
