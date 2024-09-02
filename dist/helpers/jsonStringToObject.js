"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsonStringToObject;
function jsonStringToObject(str) {
    if (!str)
        return {};
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return {};
    }
}
