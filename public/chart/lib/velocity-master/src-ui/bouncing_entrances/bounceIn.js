"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "bounceIn", {
    "duration": 750,
    "easing": "easeOutCubic",
    "0%": {
        opacity: "0",
        transform: "scale3d(0.3,0.3,0.3)",
    },
    "20%": {
        transform: "scale3d(1.1,1.1,1.1)",
    },
    "40%": {
        transform: "scale3d(0.9,0.9,0.9)",
    },
    "60%": {
        opacity: "1",
        transform: "scale3d(1.03,1.03,1.03)",
    },
    "80%": {
        transform: "scale3d(0.97,0.97,0.97)",
    },
    "100%": {
        opacity: "1",
        transform: "scale3d(1,1,1)",
    },
});
