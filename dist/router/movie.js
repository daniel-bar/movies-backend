"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var security_1 = require("../middleware/security");
var auth_1 = require("../middleware/auth");
var movie_1 = require("../controller/movie");
var router = express_1.default.Router();
router.post("/", (0, security_1.bodyKeys)([
    { key: 'title', type: 'string' },
    { key: 'description', type: 'string' },
    { key: 'category', type: 'string' },
    { key: 'release_date', type: 'number' },
    { key: 'movie_hour_length', type: 'number' },
    { key: 'movie_minute_length', type: 'number' },
]), auth_1.auth, (0, multer_1.default)({ storage: movie_1.storage }).fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), movie_1.addMovie);
router.get("/list", movie_1.getMovies);
router.get("/categories", movie_1.getCategories);
router.get("/:id", movie_1.getMovie);
router.delete('/:id', auth_1.adminAuth, movie_1.deleteMovie);
exports.default = router;
