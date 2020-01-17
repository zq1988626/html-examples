"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "swing", {
    "duration": 1000,
    "0%,100%": {
        transform: "rotate3d(0,0,1,0deg)",
        transformOrigin: "center",
    },
    "20%": {
        transform: "rotate3d(0,0,1,15deg)",
    },
    "40%": {
        transform: "rotate3d(0,0,1,-10deg)",
    },
    "60%": {
        transform: "rotate3d(0,0,1,5deg)",
    },
    "80%": {
        transform: "rotate3d(0,0,1,-5deg)",
    },
});
