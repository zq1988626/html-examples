"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const velocity_animate_1 = require("velocity-animate");
velocity_animate_1.default("registerSequence", "flip", {
    "duration": 1000,
    "0%,100%": {
        backfaceVisibility: "visible",
    },
    "0%": {
        transform: ["perspective(400px) translate3d(0,0,0) rotate3d(0,1,0,-360deg) scale3d(1,1,1)", "easeOut"],
    },
    "40%": {
        transform: ["perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg) scale3d(1,1,1)", "easeOut"],
    },
    "50%": {
        transform: ["perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg) scale3d(1,1,1)", "easeIn"],
    },
    "80%": {
        transform: ["perspective(400px) translate3d(0,0,0) rotate3d(0,1,0,0) scale3d(0.95,0.95,0.95)", "easeIn"],
    },
    "100%": {
        transform: ["perspective(400px) translate3d(0,0,0) rotate3d(0,0,0,0) scale3d(1,1,1)", "ease-in"],
    },
});
