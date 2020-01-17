"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utility_1 = require("../../utility");
exports.Actions = {};
function registerAction(args, internal) {
    const name = args[0], callback = args[1];
    if (!types_1.isString(name)) {
        console.warn(`VelocityJS: Trying to set 'registerAction' name to an invalid value:`, name);
    }
    else if (!types_1.isFunction(callback)) {
        console.warn(`VelocityJS: Trying to set 'registerAction' callback to an invalid value:`, name, callback);
    }
    else if (exports.Actions[name] && !types_1.propertyIsEnumerable(exports.Actions, name)) {
        console.warn(`VelocityJS: Trying to override internal 'registerAction' callback`, name);
    }
    else if (internal === true) {
        utility_1.defineProperty(exports.Actions, name, callback);
    }
    else {
        exports.Actions[name] = callback;
    }
}
exports.registerAction = registerAction;
registerAction(["registerAction", registerAction], true);
