"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "rubberBand", {
    "duration": 1000,
    "0%": {
        transform: "scale3d(1,1,1)",
    },
    "30%": {
        transform: "scale3d(1.25,0.75,1)",
    },
    "40%": {
        transform: "scale3d(0.75,1.25,1)",
    },
    "50%": {
        transform: "scale3d(1.15,0.85,1)",
    },
    "65%": {
        transform: "scale3d(0.95,1.05,1)",
    },
    "75%": {
        transform: "scale3d(1.05,0.95,1)",
    },
    "100%": {
        transform: "scale3d(1,1,1)",
    },
});
