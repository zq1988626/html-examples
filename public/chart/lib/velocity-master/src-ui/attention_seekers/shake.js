"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "shake", {
    "duration": 1000,
    "0%,100%": {
        transform: "translate3d(0,0,0)",
    },
    "10%,30%,50%,70%,90%": {
        transform: "translate3d(-10px,0,0)",
    },
    "20%,40%,60%,80%": {
        transform: "translate3d(10px,0,0)",
    },
});
