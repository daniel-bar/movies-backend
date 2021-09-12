"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var security_1 = require("../middleware/security");
var auth_1 = require("../middleware/auth");
var contact_1 = require("../controller/contact");
var router = express_1.default.Router();
router.post('/', auth_1.auth, (0, security_1.bodyKeys)([
    { key: 'topic', type: 'number' },
    { key: 'message', type: 'string' },
]), contact_1.contact);
router.get('/topics', auth_1.auth, contact_1.getTopics);
exports.default = router;
