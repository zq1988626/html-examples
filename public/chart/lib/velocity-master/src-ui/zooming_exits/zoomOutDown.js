"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "zoomOutDown", {
    "duration": 1000,
    "0%": {
        transform: "scale3d(1,1,1) translate3d(0,0,0)",
    },
    "40%": {
        opacity: "1",
        transform: ["scale3d(0.475,0.475,0.475) translate3d(0,60px,0)", [0.55, 0.055, 0.675, 0.19]],
    },
    "100%": {
        opacity: "0",
        transform: ["scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0)", [0.175, 0.885, 0.32, 1]],
    },
});
