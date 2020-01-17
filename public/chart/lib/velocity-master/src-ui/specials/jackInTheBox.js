"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "jackInTheBox", {
    "duration": 1000,
    "0%": {
        opacity: "0",
        transform: "scale(0.1) rotate(30deg)",
        transformOrigin: "center bottom",
    },
    "50%": {
        transform: "scale(0.5) rotate(-10deg)",
    },
    "70%": {
        transform: "scale(0.7) rotate(3deg)",
    },
    "100%": {
        opacity: "1",
        transform: "scale(1) rotate(0)",
    },
});
