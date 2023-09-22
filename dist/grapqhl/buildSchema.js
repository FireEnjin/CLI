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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var type_graphql_1 = require("type-graphql");
exports.default = (function (config) {
    if (config === void 0) { config = {}; }
    return (0, type_graphql_1.buildSchemaSync)(__assign({ resolvers: [
            process.cwd() + "/dist/models/**/*.js",
            process.cwd() + "/dist/resolvers/**/*.js",
        ], authChecker: function () { return true; }, emitSchemaFile: {
            path: process.cwd() + "/schema.gql",
            commentDescriptions: true,
        }, globalMiddlewares: [], nullableByDefault: true }, (config || {})));
});
