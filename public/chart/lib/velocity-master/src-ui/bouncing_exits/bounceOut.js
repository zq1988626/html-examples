"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "bounceOut", {
    "duration": 750,
    "0%": {
        opacity: "1",
        transform: "scale3d(1,1,1)",
    },
    "20%": {
        transform: "scale3d(0.9,0.9,0.9)",
    },
    "50%,55%": {
        opacity: "1",
        transform: "scale3d(1.1,1.1,1.1)",
    },
    "to": {
        opacity: "0",
        transform: "scale3d(0.3,0.3,0.3)",
    },
});
