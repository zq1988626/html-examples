"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "bounceInRight", {
    "duration": 1000,
    "0%": {
        opacity: "0",
        transform: "translate3d(3000px,0,0)",
    },
    "60%": {
        opacity: "1",
        transform: ["translate3d(-25px,0,0)", "easeOutCubic"],
    },
    "75%": {
        transform: ["translate3d(10px,0,0)", "easeOutCubic"],
    },
    "90%": {
        transform: ["translate3d(-5px,0,0)", "easeOutCubic"],
    },
    "100%": {
        transform: ["translate3d(0,0,0)", "easeOutCubic"],
    },
});
