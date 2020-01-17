"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "bounceOutDown", {
    "duration": 1000,
    "0%": {
        opacity: "1",
        transform: "translate3d(0,0,0)",
    },
    "20%": {
        transform: "translate3d(0,10px,0)",
    },
    "40%,45%": {
        opacity: "1",
        transform: "translate3d(0,-20px,0)",
    },
    "100%": {
        opacity: "0",
        transform: "translate3d(0,2000px,0)",
    },
});
