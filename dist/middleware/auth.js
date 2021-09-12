"use strict";
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
exports.adminAuth = exports.auth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var server_global_1 = __importDefault(require("../server-global"));
var index_1 = require("../model/shared/index");
var auth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, userDocument, userId, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info('[auth middleware]: Start processing request');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                token = req.header('Authorization').replace('Bearer ', '');
                data = jsonwebtoken_1.default.verify(token, process.env.JWT_PWD);
                return [4, index_1.User.findByPk(data.id)];
            case 2:
                userDocument = _a.sent();
                if (!userDocument) {
                    server_global_1.default.getInstance().logger.error("\n                [auth middleware]: Failed to authenticate because could not find user with id " + data.id);
                    res.status(401).send({
                        success: false,
                        message: 'Unable to authenticate'
                    });
                    return [2];
                }
                userId = data.id;
                return [3, 4];
            case 3:
                e_1 = _a.sent();
                server_global_1.default.getInstance().logger.error("[auth middleware]: Failed to authenticate because of error: " + e_1);
                if (e_1.message = 'jwt malformed') {
                    res.status(401).send({
                        success: false,
                        message: 'Unable to authenticate'
                    });
                    return [2];
                }
                res.status(500).send({
                    success: false,
                    message: 'Server error',
                });
                return [2];
            case 4:
                server_global_1.default.getInstance().logger.info("[auth middleware]: Successfully authenticated user with id " + userId);
                req.userId = userId;
                next();
                return [2];
        }
    });
}); };
exports.auth = auth;
var adminAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, data, adminDocument, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info('[admin auth middleware]: Start processing request');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                token = req.header('Authorization').replace('Bearer ', '');
                data = jsonwebtoken_1.default.verify(token, process.env.JWT_PWD);
                return [4, index_1.User.findByPk(data.id)];
            case 2:
                adminDocument = _a.sent();
                if (!adminDocument || adminDocument.email !== process.env.ADMIN_EMAIL) {
                    server_global_1.default.getInstance().logger.error("[admin auth middleware]: Failed to authenticate administrator for id: " + data.id);
                    res.status(401).send({
                        success: false,
                        message: 'Unable to authenticate'
                    });
                    return [2];
                }
                server_global_1.default.getInstance().logger.info("[admin auth middleware]: Successfully authenticated administrator with id " + data.id);
                next();
                return [3, 4];
            case 3:
                e_2 = _a.sent();
                server_global_1.default.getInstance().logger.error("[admin auth middleware]: Failed to authenticate administrator because of error: " + e_2);
                if (e_2.message = 'jwt malformed') {
                    res.status(401).send({
                        success: false,
                        message: 'Unable to authenticate'
                    });
                    return [2];
                }
                res.status(500).send({
                    success: false,
                    message: 'Server error',
                });
                return [2];
            case 4: return [2];
        }
    });
}); };
exports.adminAuth = adminAuth;
