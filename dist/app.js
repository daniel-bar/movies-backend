"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var auth_1 = __importDefault(require("./router/auth"));
var movie_1 = __importDefault(require("./router/movie"));
var contact_1 = __importDefault(require("./router/contact"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../../movies-backend/data/images')));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.HTTP_ACCESS_IP);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT');
    next();
});
app.get('/alive', function (req, res, next) { return res.status(200).send('Data server is alive'); });
app.use('/auth', auth_1.default);
app.use('/movie', movie_1.default);
app.use('/contact', contact_1.default);
exports.default = app;
