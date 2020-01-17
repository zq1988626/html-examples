"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "zoomOutLeft", {
    "duration": 1000,
    "0%": {
        opacity: "1",
        transform: "scale(1) translate3d(0,0,0)",
        transformOrigin: "left center",
    },
    "40%": {
        opacity: "1",
        transform: "scale(0.475) translate3d(42px,0,0)",
    },
    "100%": {
        opacity: "0",
        transform: "scale(0.1) translate3d(-2000px,0,0)",
        transformOrigin: "left center",
    },
});
