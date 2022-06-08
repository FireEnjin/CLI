"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var type_graphql_1 = require("type-graphql");
exports.default = (function (config) {
    if (config === void 0) { config = {
        resolvers: [
            process.cwd() + "/dist/models/**/*.js",
            process.cwd() + "/dist/resolvers/**/*.js",
        ],
        authChecker: function () { return true; },
        emitSchemaFile: {
            path: process.cwd() + "/schema.gql",
            commentDescriptions: true,
        },
        globalMiddlewares: [],
        nullableByDefault: true,
    }; }
    return (0, type_graphql_1.buildSchemaSync)(config);
});
