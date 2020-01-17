"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "flipOutY", {
    "duration": 750,
    "0%,100%": {
        backfaceVisibility: "visible",
    },
    "0%": {
        transform: "perspective(400px) rotate3d(0,1,0,0)",
    },
    "30%": {
        opacity: "1",
        transform: "perspective(400px) rotate3d(0,1,0,-20deg)",
    },
    "100%": {
        opacity: "0",
        transform: "perspective(400px) rotate3d(0,1,0,90deg)",
    },
});
