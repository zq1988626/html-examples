"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "flipInY", {
    "duration": 1000,
    "0%,100%": {
        backfaceVisibility: "visible",
    },
    "0%": {
        opacity: "0",
        transform: "perspective(400px) rotate3d(0,1,0,90deg)",
    },
    "40%": {
        transform: ["perspective(400px) rotate3d(0,1,0,-20deg)", "easeIn"],
    },
    "60%": {
        opacity: "1",
        transform: "perspective(400px) rotate3d(0,1,0,10deg)",
    },
    "80%": {
        transform: "perspective(400px) rotate3d(0,1,0,-5deg)",
    },
    "100%": {
        transform: "perspective(400px) rotate3d(0,1,0,0)",
    },
});
