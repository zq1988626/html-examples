"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "lightSpeedOut", {
    "duration": 1000,
    "easing": "easeIn",
    "0%": {
        opacity: "1",
        transform: "translate3d(0,0,0) skewX(0)",
    },
    "100%": {
        opacity: "0",
        transform: "translate3d(100%,0,0) skewX(30deg)",
    },
});
