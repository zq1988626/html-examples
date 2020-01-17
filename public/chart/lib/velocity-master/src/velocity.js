"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("./utility");
const actions_1 = require("./Velocity/actions/actions");
const defaults_1 = require("./Velocity/defaults");
const easings_1 = require("./Velocity/easing/easings");
const patch_1 = require("./Velocity/patch");
const sequencesObject_1 = require("./Velocity/sequencesObject");
const state_1 = require("./Velocity/state");
const velocityFn_1 = require("./velocityFn");
require("./Velocity/_all");
const version_1 = require("../version");
const Velocity = velocityFn_1.Velocity;
var VelocityStatic;
(function (VelocityStatic) {
    VelocityStatic.Actions = actions_1.Actions;
    VelocityStatic.Easings = easings_1.Easings;
    VelocityStatic.Sequences = sequencesObject_1.SequencesObject;
    VelocityStatic.State = state_1.State;
    VelocityStatic.defaults = defaults_1.defaults;
    VelocityStatic.patch = patch_1.patch;
    VelocityStatic.debug = false;
    VelocityStatic.mock = false;
    VelocityStatic.version = version_1.VERSION;
    VelocityStatic.Velocity = velocityFn_1.Velocity;
})(VelocityStatic || (VelocityStatic = {}));
const IE = (() => {
    if (document.documentMode) {
        return document.documentMode;
    }
    else {
        for (let i = 7; i > 4; i--) {
            let div = document.createElement("div");
            div.innerHTML = `<!${"--"}[if IE ${i}]><span></span><![endif]-->`;
            if (div.getElementsByTagName("span").length) {
                div = null;
                return i;
            }
        }
    }
    return undefined;
})();
if (IE <= 8) {
    throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
}
if (window) {
    const jQuery = window.jQuery, Zepto = window.Zepto;
    patch_1.patch(window, true);
    patch_1.patch(Element && Element.prototype);
    patch_1.patch(NodeList && NodeList.prototype);
    patch_1.patch(HTMLCollection && HTMLCollection.prototype);
    patch_1.patch(jQuery, true);
    patch_1.patch(jQuery && jQuery.fn);
    patch_1.patch(Zepto, true);
    patch_1.patch(Zepto && Zepto.fn);
}
for (const property in VelocityStatic) {
    if (VelocityStatic.hasOwnProperty(property)) {
        switch (typeof property) {
            case "number":
            case "boolean":
                utility_1.defineProperty(Velocity, property, {
                    get() {
                        return VelocityStatic[property];
                    },
                    set(value) {
                        VelocityStatic[property] = value;
                    },
                }, true);
                break;
            default:
                utility_1.defineProperty(Velocity, property, VelocityStatic[property], true);
                break;
        }
    }
}
Object.freeze(Velocity);
exports.default = Velocity;
