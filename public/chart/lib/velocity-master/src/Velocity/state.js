"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const isClient = window && window === window.window, windowScrollAnchor = isClient && window.pageYOffset !== undefined;
exports.State = {
    isClient,
    isMobile: isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isGingerbread: isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
    prefixElement: isClient && document.createElement("div"),
    windowScrollAnchor,
    scrollAnchor: windowScrollAnchor ? window : (!isClient || document.documentElement || document.body.parentNode || document.body),
    scrollPropertyLeft: windowScrollAnchor ? "pageXOffset" : "scrollLeft",
    scrollPropertyTop: windowScrollAnchor ? "pageYOffset" : "scrollTop",
    className: constants_1.CLASSNAME,
    isTicking: false,
    first: undefined,
    last: undefined,
    firstNew: undefined,
};
