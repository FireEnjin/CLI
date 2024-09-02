"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getHandlebarsHelpers;
var lodash_1 = require("lodash");
var date_fns_1 = require("date-fns");
var jsonLogic = __importStar(require("json-logic-js"));
function getHandlebarsHelpers() {
    return {
        everyNth: function (context, every, options) {
            var fn = options.fn, inverse = options.inverse;
            var ret = "";
            if (context && context.length > 0) {
                for (var i = 0, j = context.length; i < j; i++) {
                    var modZero = i % every === 0;
                    ret =
                        ret +
                            fn((0, lodash_1.extend)({}, context[i], {
                                isModZero: modZero,
                                isModZeroNotFirst: modZero && i > 0,
                                isLast: i === context.length - 1,
                            }));
                }
            }
            else {
                ret = inverse(this);
            }
            return ret;
        },
        logic: function (context, rules, tempData) {
            return jsonLogic.apply(JSON.parse(rules.replace('"@tempData"', tempData)), __assign(__assign({}, context), { tempData: tempData }));
        },
        formatUSD: function (amount) {
            var formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
            });
            return formatter.format(amount ? amount : 0);
        },
        date: function (str, datePattern, options) {
            var _a;
            if (datePattern === void 0) { datePattern = "P"; }
            if (options === void 0) { options = {}; }
            try {
                var dateObj = typeof str === "object" && ((_a = str === null || str === void 0 ? void 0 : str.constructor) === null || _a === void 0 ? void 0 : _a.name) === "Timestamp"
                    ? str.toDate()
                    : str || new Date();
                return (0, date_fns_1.format)(typeof dateObj === "string" ? (0, date_fns_1.parseISO)(dateObj) : dateObj, typeof datePattern === "string" ? datePattern : "P", options);
            }
            catch (error) {
                return str;
            }
        },
    };
}
