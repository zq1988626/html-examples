"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "bounceInUp", {
    "duration": 1000,
    "0%": {
        opacity: "0",
        transform: "translate3d(0,3000px,0)",
    },
    "60%": {
        opacity: "1",
        transform: ["translate3d(0,-25px,0)", "easeOutCubic"],
    },
    "75%": {
        transform: ["translate3d(0,10px,0)", "easeOutCubic"],
    },
    "90%": {
        transform: ["translate3d(0,-5px,0)", "easeOutCubic"],
    },
    "100%": {
        transform: ["translate3d(0,0,0)", "easeOutCubic"],
    },
});
