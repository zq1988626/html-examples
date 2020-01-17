"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "lightSpeedIn", {
    "duration": 1000,
    "easing": "easeOut",
    "0%": {
        opacity: "0",
        transform: "translate3d(100%,0,0) skewX(-30deg)",
    },
    "60%": {
        opacity: "1",
        transform: "translate3d(40%,0,0) skewX(20deg)",
    },
    "80%": {
        opacity: "1",
        transform: "translate3d(20%,0,0) skewX(-5deg)",
    },
    "100%": {
        opacity: "1",
        transform: "translate3d(0,0,0) skew(0)",
    },
});
