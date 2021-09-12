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
exports.editProfile = exports.autoLogin = exports.login = exports.register = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var server_global_1 = __importDefault(require("../server-global"));
var index_1 = require("../model/shared/index");
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isEmailValid, matchingUser, hashedPassword, newUser, newToken, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<register>: Start processing request with email: " + req.body.email);
                if (req.body.username.length < 3 || req.body.username.length > 26) {
                    server_global_1.default.getInstance().logger.error("<register>: Failed to register since provided invalid username with email " + req.body.email);
                    res.status(400).send({
                        success: false,
                        message: "Please provide valid username",
                    });
                    return [2];
                }
                isEmailValid = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.email);
                if (!isEmailValid) {
                    server_global_1.default.getInstance().logger.error("<register>: Failed to register since provided invalid email " + req.body.email);
                    res.status(400).send({
                        success: false,
                        message: "Please provide valid email",
                    });
                    return [2];
                }
                if (req.body.password.length < 7 || req.body.password.length > 24) {
                    server_global_1.default.getInstance().logger.error("<register>: Failed to register since provided invalid password with email " + req.body.email);
                    res.status(400).send({
                        success: false,
                        message: "Please provide valid password",
                    });
                    return [2];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4, index_1.User.findOne({ where: { email: req.body.email } })];
            case 2:
                matchingUser = _a.sent();
                if (matchingUser) {
                    server_global_1.default.getInstance().logger.error("<register>: Failed to register because provided email " + req.body.email + " is already exist");
                    res.status(400).send({
                        success: false,
                        message: "Registration failed - provided email is already exist",
                    });
                    return [2];
                }
                return [4, bcryptjs_1.default.hash(req.body.password, 8)];
            case 3:
                hashedPassword = _a.sent();
                return [4, index_1.User.create({
                        email: req.body.email,
                        username: req.body.username,
                        password: hashedPassword,
                    })];
            case 4:
                newUser = _a.sent();
                newToken = jsonwebtoken_1.default.sign({ id: newUser.id }, process.env.JWT_PWD, {
                    expiresIn: "7 days",
                });
                return [4, index_1.Token.create({
                        token: newToken,
                        userId: newUser.id
                    })];
            case 5:
                _a.sent();
                server_global_1.default.getInstance().logger.info("<register>: Successfully registered user with ID: " + newUser.id);
                res.status(201).send({
                    success: true,
                    message: "Successfully created a new user",
                    data: {
                        username: req.body.username,
                        email: req.body.email,
                        token: newToken,
                    },
                });
                return [2];
            case 6:
                e_1 = _a.sent();
                server_global_1.default.getInstance().logger.error("<register>: Failed to register because of server error: " + e_1);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 7: return [2];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userByEmail, compareResult, tokenByUserId, newToken, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<login>: Start processing request with email: " + req.body.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4, index_1.User.findOne({ where: { email: req.body.email } })];
            case 2:
                userByEmail = _a.sent();
                if (!userByEmail) {
                    server_global_1.default.getInstance().logger.error("<login>: Failed to login because the email " + req.body.email + " does not match any user");
                    res.status(400).send({
                        success: false,
                        message: "Authentication failed",
                    });
                    return [2];
                }
                return [4, bcryptjs_1.default.compare(req.body.password, userByEmail.password)];
            case 3:
                compareResult = _a.sent();
                if (!compareResult) {
                    server_global_1.default.getInstance().logger.error("<login>: Failed to login because the password does not match the hashed password with email " + req.body.email);
                    res.status(400).send({
                        success: false,
                        message: "Authentication failed",
                    });
                    return [2];
                }
                return [4, index_1.Token.findOne({ where: { userId: userByEmail.id } })];
            case 4:
                tokenByUserId = _a.sent();
                newToken = jsonwebtoken_1.default.sign({ id: userByEmail.id }, process.env.JWT_PWD, {
                    expiresIn: "7 days",
                });
                newToken = tokenByUserId === null || tokenByUserId === void 0 ? void 0 : tokenByUserId.token;
                if (tokenByUserId === null) {
                    server_global_1.default.getInstance().logger.error("<login>: Failed to login because token is null");
                    res.status(400).send({
                        success: false,
                        message: "Token error",
                    });
                    return [2];
                }
                return [4, tokenByUserId.save()];
            case 5:
                _a.sent();
                return [4, userByEmail.save()];
            case 6:
                _a.sent();
                server_global_1.default.getInstance().logger.info("<login>: Successfully logged user in with email: " + req.body.email + " to user id: " + userByEmail.id);
                res.status(200).send({
                    success: true,
                    message: "Successfully authenticated",
                    data: {
                        username: userByEmail.username,
                        email: req.body.email,
                        token: newToken,
                    },
                });
                return [2];
            case 7:
                e_2 = _a.sent();
                server_global_1.default.getInstance().logger.error("<register>: Failed to login with email " + req.body.email + " because of server error: " + e_2);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 8: return [2];
        }
    });
}); };
exports.login = login;
var autoLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userId, token, data, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<autoLogin>: Start processing request");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                token = req.header("Authorization").replace("Bearer ", "");
                data = jsonwebtoken_1.default.verify(token, process.env.JWT_PWD);
                return [4, index_1.User.findByPk(data.id)];
            case 2:
                user = _a.sent();
                if (!user) {
                    server_global_1.default.getInstance().logger.error("<autoLogin>: Failed to auto login with user id of " + data.id);
                    res.status(401).send({
                        success: false,
                        message: "Unable to auto login",
                    });
                    return [2];
                }
                userId = data.id;
                return [3, 4];
            case 3:
                e_3 = _a.sent();
                server_global_1.default.getInstance().logger.error("<autoLogin>: Failed to auto login because of login error: " + e_3);
                res.status(401).send({
                    success: false,
                    message: "Unable to auto login",
                });
                return [2];
            case 4:
                server_global_1.default.getInstance().logger.info("<autoLogin>: Successfully auto login user with id " + userId);
                res.status(200).send({
                    success: true,
                    message: "Successful auto login",
                    data: {
                        username: user.username,
                        email: user.email,
                    },
                });
                return [2];
        }
    });
}); };
exports.autoLogin = autoLogin;
var editProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userByID, compareResult, hashedNewPassword, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<editProfile>: Start processing request with user id " + req.userId);
                if ((req.body.newPassword.length < 7 && req.body.newPassword.length > 0) ||
                    req.body.newPassword.length > 24) {
                    res.status(400).send({
                        success: false,
                        message: "Invalid form fields",
                    });
                    return [2];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4, index_1.User.findByPk(req.userId)];
            case 2:
                userByID = _a.sent();
                if (!userByID) {
                    server_global_1.default.getInstance().logger.error("<editProfile>: Failed to get user details for user id " + req.userId);
                    res.status(401).send({
                        success: false,
                        message: "Could not find user",
                    });
                    return [2];
                }
                return [4, bcryptjs_1.default.compare(req.body.password, userByID.password)];
            case 3:
                compareResult = _a.sent();
                if (!compareResult) {
                    server_global_1.default.getInstance().logger.error("<editProfile>: Failed to edit profile because provided password mismatches for user id " + req.userId);
                    res.status(400).send({
                        success: false,
                        message: "Mismatch password",
                    });
                    return [2];
                }
                if (req.body.newEmail !== "") {
                    userByID.email === req.body.newEmail;
                }
                if (!(req.body.newPassword !== "")) return [3, 5];
                return [4, bcryptjs_1.default.hash(req.body.newPassword, 8)];
            case 4:
                hashedNewPassword = _a.sent();
                userByID.password = hashedNewPassword;
                _a.label = 5;
            case 5: return [4, userByID.save()];
            case 6:
                _a.sent();
                server_global_1.default.getInstance().logger.info("<editProfile>: Successfully edited user profile with id " + req.userId);
                res.status(200).send({
                    success: true,
                    message: "Successfully edited user details",
                });
                return [2];
            case 7:
                e_4 = _a.sent();
                server_global_1.default.getInstance().logger.error("<editProfile>: Failed to edit profile because of server error: " + e_4);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 8: return [2];
        }
    });
}); };
exports.editProfile = editProfile;
