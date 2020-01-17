"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "zoomOut", {
    "duration": 1000,
    "0%": {
        transform: "scale3d(1,1,1)",
    },
    "50%": {
        opacity: "1",
    },
    "100%": {
        opacity: "0",
        transform: "scale3d(0.3,0.3,0.3)",
    },
});
