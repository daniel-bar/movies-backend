"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../middleware/auth");
var security_1 = require("../middleware/security");
var auth_2 = require("../controller/auth");
var router = express_1.default.Router();
router.post('/register', (0, security_1.bodyKeys)([
    { key: 'username', type: 'string' },
    { key: 'email', type: 'string' },
    { key: 'password', type: 'string' },
]), auth_2.register);
router.post('/login', (0, security_1.bodyKeys)([
    { key: 'email', type: 'string' },
    { key: 'password', type: 'string' },
]), auth_2.login);
router.get('/', auth_2.autoLogin);
router.patch("/", auth_1.auth, (0, security_1.bodyKeys)([{ key: "password", type: "string" }]), auth_2.editProfile);
exports.default = router;
