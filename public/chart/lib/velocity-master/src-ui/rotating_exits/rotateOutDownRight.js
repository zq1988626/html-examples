"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "rotateOutDownRight", {
    "duration": 1000,
    "0%": {
        opacity: "1",
        transform: "translate3d(0,0,0)",
        transformOrigin: "right bottom",
    },
    "100%": {
        opacity: "0",
        transform: "rotate3d(0,0,1,-45deg)",
        transformOrigin: "right bottom",
    },
});
