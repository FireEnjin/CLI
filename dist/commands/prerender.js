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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var jsonStringToObject_1 = __importDefault(require("../helpers/jsonStringToObject"));
var readFilesToArray_1 = __importDefault(require("../helpers/readFilesToArray"));
var renderHandlebarsTemplateToFile_1 = __importDefault(require("../helpers/renderHandlebarsTemplateToFile"));
var yargs = require("yargs").argv;
exports.default = (function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var env, formatWithPrettier, dir, title, head, body, template, outFile, data, partialsPath, partialFilenames, partials, templatesDir, _i, _a, filename, filenameParts;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                env = {};
                try {
                    env = require("".concat(process.cwd(), "/environment.json"));
                }
                catch (error) {
                    console.log("No environment file found.");
                }
                formatWithPrettier = (yargs === null || yargs === void 0 ? void 0 : yargs.f) || (yargs === null || yargs === void 0 ? void 0 : yargs.format) || ((_b = env === null || env === void 0 ? void 0 : env.prerender) === null || _b === void 0 ? void 0 : _b.formatWithPrettier) || false;
                dir = (yargs === null || yargs === void 0 ? void 0 : yargs.d) || (yargs === null || yargs === void 0 ? void 0 : yargs.dir) || ((_c = env === null || env === void 0 ? void 0 : env.prerender) === null || _c === void 0 ? void 0 : _c.dir)
                    ? "".concat(process.cwd(), "/").concat((yargs === null || yargs === void 0 ? void 0 : yargs.d) || (yargs === null || yargs === void 0 ? void 0 : yargs.dir) || ((_d = env === null || env === void 0 ? void 0 : env.prerender) === null || _d === void 0 ? void 0 : _d.dir))
                    : "".concat(process.cwd(), "/www");
                title = (yargs === null || yargs === void 0 ? void 0 : yargs.t) || (yargs === null || yargs === void 0 ? void 0 : yargs.title) || ((_e = env === null || env === void 0 ? void 0 : env.prerender) === null || _e === void 0 ? void 0 : _e.title);
                head = (yargs === null || yargs === void 0 ? void 0 : yargs.h) || (yargs === null || yargs === void 0 ? void 0 : yargs.head) || ((_f = env === null || env === void 0 ? void 0 : env.prerender) === null || _f === void 0 ? void 0 : _f.head) || "";
                body = (yargs === null || yargs === void 0 ? void 0 : yargs.b) || (yargs === null || yargs === void 0 ? void 0 : yargs.body) || ((_g = env === null || env === void 0 ? void 0 : env.prerender) === null || _g === void 0 ? void 0 : _g.body) || "";
                template = (yargs === null || yargs === void 0 ? void 0 : yargs.i) ||
                    (yargs === null || yargs === void 0 ? void 0 : yargs.in) ||
                    (yargs === null || yargs === void 0 ? void 0 : yargs.template) ||
                    ((_h = env === null || env === void 0 ? void 0 : env.prerender) === null || _h === void 0 ? void 0 : _h.templateFile) ||
                    "index.hbs";
                outFile = (yargs === null || yargs === void 0 ? void 0 : yargs.o) || (yargs === null || yargs === void 0 ? void 0 : yargs.out) || ((_j = env === null || env === void 0 ? void 0 : env.prerender) === null || _j === void 0 ? void 0 : _j.outFile) || "index.html";
                data = (0, jsonStringToObject_1.default)((yargs === null || yargs === void 0 ? void 0 : yargs.d) || (yargs === null || yargs === void 0 ? void 0 : yargs.data)) || ((_k = env === null || env === void 0 ? void 0 : env.prerender) === null || _k === void 0 ? void 0 : _k.data);
                partialsPath = (yargs === null || yargs === void 0 ? void 0 : yargs.p) ||
                    (yargs === null || yargs === void 0 ? void 0 : yargs.partials) ||
                    ((_l = env === null || env === void 0 ? void 0 : env.prerender) === null || _l === void 0 ? void 0 : _l.partials) ||
                    "".concat(process.cwd(), "/templates/partials");
                return [4 /*yield*/, (0, readFilesToArray_1.default)(partialsPath)];
            case 1:
                partialFilenames = _o.sent();
                partials = [];
                templatesDir = (yargs === null || yargs === void 0 ? void 0 : yargs.templatesDir) ||
                    ((_m = env === null || env === void 0 ? void 0 : env.prerender) === null || _m === void 0 ? void 0 : _m.templatesDir) ||
                    "".concat(process.cwd(), "/templates");
                for (_i = 0, _a = partialFilenames || []; _i < _a.length; _i++) {
                    filename = _a[_i];
                    filenameParts = filename.split(".");
                    if ((filenameParts === null || filenameParts === void 0 ? void 0 : filenameParts.length) > 1)
                        filenameParts.pop();
                    try {
                        partials.push({
                            id: filenameParts.join("."),
                            html: fs_1.default.readFileSync("".concat(partialsPath, "/").concat(filename)).toString(),
                        });
                    }
                    catch (e) {
                        console.log("Error loading partial ".concat(filename, ": "), e);
                    }
                }
                return [4 /*yield*/, (0, renderHandlebarsTemplateToFile_1.default)(template, "".concat(dir, "/").concat(outFile), {
                        data: __assign(__assign({}, (data || {})), { title: title, head: head, body: body }),
                        formatWithPrettier: formatWithPrettier,
                        partials: partials,
                        templatesDir: [".", "./", "/"].includes(templatesDir) || template !== "index.hbs"
                            ? process.cwd()
                            : templatesDir,
                    })];
            case 2:
                _o.sent();
                return [2 /*return*/, true];
        }
    });
}); });
