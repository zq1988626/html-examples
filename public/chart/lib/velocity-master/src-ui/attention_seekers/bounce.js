"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "bounce", {
    "duration": 1000,
    "0,100%": {
        transformOrigin: "center bottom",
    },
    "0%,20%,53%,80%,100%": {
        transform: ["translate3d(0,0px,0)", "easeOutCubic"],
    },
    "40%,43%": {
        transform: ["translate3d(0,-30px,0)", "easeInQuint"],
    },
    "70%": {
        transform: ["translate3d(0,-15px,0)", "easeInQuint"],
    },
    "90%": {
        transform: "translate3d(0,-4px,0)",
    },
});
