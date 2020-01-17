"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "pulse", {
    "duration": 1000,
    "0%": {
        transform: "scale3d(1,1,1)",
    },
    "50%": {
        transform: "scale3d(1.05,1.05,1.05)",
    },
    "100%": {
        transform: "scale3d(1,1,1)",
    },
});
