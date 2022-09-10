"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = jsonStringToObject;
