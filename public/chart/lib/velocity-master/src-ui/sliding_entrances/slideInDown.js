"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "slideInDown", {
    "duration": 1000,
    "0%": {
        transform: "translate3d(0,-100%,0)",
        visibility: "hidden",
        opacity: "0",
    },
    "100%": {
        transform: "translate3d(0,0,0)",
        visibility: "visible",
        opacity: "1",
    },
});
