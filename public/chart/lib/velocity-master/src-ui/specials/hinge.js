"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "hinge", {
    "duration": 2000,
    "0%": {
        opacity: "1",
        transform: "translate3d(0,0,0) rotate3d(0,0,1,0)",
        transformOrigin: "top left",
    },
    "20%,60%": {
        transform: ["translate3d(0,0,0) rotate3d(0,0,1,80deg)", "easeInOut"],
    },
    "40%,80%": {
        opacity: "1",
        transform: ["translate3d(0,0,0) rotate3d(0,0,1,60deg)", "easeInOut"],
    },
    "100%": {
        opacity: "0",
        transform: ["translate3d(0,700px,0) rotate3d(0,0,1,80deg)", "easeInOut"],
    },
});
