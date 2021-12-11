"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
        while (_) try {
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
var tiny_glob_1 = __importDefault(require("tiny-glob"));
var fbAdmin = __importStar(require("firebase-admin"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
function checkForReferences(object) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var data, _i, _b, key, value;
        return __generator(this, function (_c) {
            data = object;
            for (_i = 0, _b = Object.keys(object); _i < _b.length; _i++) {
                key = _b[_i];
                value = object[key];
                if (((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === "Timestamp") {
                    data[key] = value.toDate();
                }
                else if (typeof value === undefined) {
                    data[key] = null;
                }
            }
            return [2 /*return*/, data];
        });
    });
}
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    function connectDatabase() {
        var _a, _b, _c;
        var serviceAccountKey = JSON.parse(fs.readFileSync("".concat(process.cwd(), "/service-account.json"), "utf8"));
        var project = serviceAccountKey.project_id;
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccountKey),
            databaseURL: "https://".concat(project, ".firebaseio.com"),
            storageBucket: "".concat(project, ".appspot.com"),
        });
        var firestore = fbAdmin.firestore();
        if ((env === null || env === void 0 ? void 0 : env.emulate) || ((_a = env === null || env === void 0 ? void 0 : env.firestore) === null || _a === void 0 ? void 0 : _a.emulate)) {
            console.log(" I ran");
            firestore.settings({
                host: ((_b = env.firestore) === null || _b === void 0 ? void 0 : _b.host) ? env.firestore.host : "localhost:8080",
                ssl: !!((_c = env.firestore) === null || _c === void 0 ? void 0 : _c.ssl),
            });
        }
        return firestore;
    }
    var env, getDirectories, seedCount, seedGlob, files, _i, seedGlob_1, seedFolder, _a, _b, _c, db, _d, files_1, file, pathArr, currentSeed, _e, isDocument, docRef, i, _f, _g, error_1;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                env = require("".concat(process.cwd(), "/environment.json"));
                getDirectories = function (source) {
                    return fs
                        .readdirSync(source, { withFileTypes: true })
                        .filter(function (dirent) { return dirent.isDirectory(); })
                        .map(function (dirent) { return dirent.name; });
                };
                seedCount = 0;
                seedGlob = (process.argv[3]
                    ? process.argv[3]
                    : (env === null || env === void 0 ? void 0 : env.defaultSeeds)
                        ? env.defaultSeeds
                        : getDirectories("".concat(process.cwd(), "/dist/seeds")).join(","))
                    .split(",")
                    .map(function (collection) { return "./dist/seeds/".concat(collection, "/**/*.js"); });
                files = [];
                _i = 0, seedGlob_1 = seedGlob;
                _h.label = 1;
            case 1:
                if (!(_i < seedGlob_1.length)) return [3 /*break*/, 4];
                seedFolder = seedGlob_1[_i];
                _b = (_a = files.push).apply;
                _c = [files];
                return [4 /*yield*/, (0, tiny_glob_1.default)(seedFolder)];
            case 2:
                _b.apply(_a, _c.concat([(_h.sent())]));
                _h.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                db = connectDatabase();
                _d = 0, files_1 = files;
                _h.label = 5;
            case 5:
                if (!(_d < files_1.length)) return [3 /*break*/, 14];
                file = files_1[_d];
                _h.label = 6;
            case 6:
                _h.trys.push([6, 12, , 13]);
                pathArr = file.split(path.sep);
                currentSeed = require("".concat(file.replace("dist".concat(path.sep), "".concat(process.cwd()).concat(path.sep, "dist").concat(path.sep)))).default(db);
                if (!(typeof currentSeed.then === "function")) return [3 /*break*/, 8];
                return [4 /*yield*/, currentSeed];
            case 7:
                _e = _h.sent();
                return [3 /*break*/, 9];
            case 8:
                _e = currentSeed;
                _h.label = 9;
            case 9:
                currentSeed = _e;
                isDocument = pathArr[3].indexOf(".") >= 0;
                docRef = db
                    .collection(pathArr[2])
                    .doc(isDocument ? pathArr[3].split(".")[0] : pathArr[3]);
                if (!isDocument) {
                    for (i = 5; i < pathArr.length; i++) {
                        isDocument = pathArr[i].indexOf(".") >= 0;
                        docRef =
                            isDocument || docRef
                                ? docRef.doc(isDocument ? pathArr[i].split(".")[0] : pathArr[i])
                                : docRef.collection(pathArr[i]);
                    }
                }
                _g = (_f = docRef).set;
                return [4 /*yield*/, checkForReferences(currentSeed)];
            case 10: return [4 /*yield*/, _g.apply(_f, [_h.sent()])];
            case 11:
                _h.sent();
                seedCount = seedCount + 1;
                return [3 /*break*/, 13];
            case 12:
                error_1 = _h.sent();
                console.log("Seed failed to run", file, error_1);
                return [3 /*break*/, 13];
            case 13:
                _d++;
                return [3 /*break*/, 5];
            case 14:
                console.log("".concat(seedCount, " seeds ran successfully!"));
                return [2 /*return*/];
        }
    });
}); });
