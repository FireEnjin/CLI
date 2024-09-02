"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renderHandlebars;
var Handlebars = __importStar(require("handlebars"));
var getHandlebarsHelpers_1 = __importDefault(require("./getHandlebarsHelpers"));
var currentHelpers = [];
/**
 * Render a lump of handlebars
 */
function renderHandlebars(templateStr, data, options) {
    for (var _i = 0, _a = (options === null || options === void 0 ? void 0 : options.partials) || []; _i < _a.length; _i++) {
        var partial = _a[_i];
        Handlebars.registerPartial(partial.id, (partial === null || partial === void 0 ? void 0 : partial.html) || "");
    }
    try {
        var helpers = (Object.keys((options === null || options === void 0 ? void 0 : options.helpers) || []).length
            ? options === null || options === void 0 ? void 0 : options.helpers
            : (0, getHandlebarsHelpers_1.default)());
        for (var _b = 0, _c = Object.entries(helpers); _b < _c.length; _b++) {
            var _d = _c[_b], helperName = _d[0], helperFn = _d[1];
            try {
                if (currentHelpers.includes(helperName))
                    Handlebars.unregisterHelper(helperName);
                Handlebars.registerHelper(helperName, helperFn);
                if (!currentHelpers.includes(helperName))
                    currentHelpers = __spreadArray(__spreadArray([], currentHelpers, true), [helperName], false);
            }
            catch (error) {
                console.log("Error setting helper ".concat(helperName, "."), error);
            }
        }
    }
    catch (_e) {
        console.log("Error setting helpers.");
    }
    return Handlebars.compile(templateStr)(data);
}
