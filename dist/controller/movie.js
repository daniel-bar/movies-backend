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
exports.deleteMovie = exports.getCategories = exports.getMovie = exports.getMovies = exports.addMovie = exports.storage = void 0;
var mime_types_1 = __importDefault(require("mime-types"));
var multer_1 = __importDefault(require("multer"));
var server_global_1 = __importDefault(require("../server-global"));
var index_1 = require("../model/shared/index");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './data');
    },
    filename: function (req, file, cb) {
        var ext = mime_types_1.default.extension(file.mimetype);
        var random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        cb(null, Date.now() + "-" + random + "." + ext);
    },
});
exports.storage = storage;
var addMovie = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, newMovie, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<addMovie>: Start processing request");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (req.body.title.length < 3 ||
                    req.body.title.length > 26 ||
                    req.body.description.length < 3 ||
                    req.body.description.length > 280) {
                    server_global_1.default.getInstance().logger.error("<addMovie>: Failed to add movie because invalid fields length");
                    res.status(400).send({
                        success: false,
                        message: "Please provide valid length of movie fields",
                    });
                    return [2];
                }
                if (isNaN(req.body.movie_hour_length ||
                    req.body.movie_minute_length ||
                    req.body.release_date)) {
                    server_global_1.default.getInstance().logger.error("<addMovie>: Failed to add product because invalid hour, minute or release date");
                    res.status(400).send({
                        success: false,
                        message: "Please provide valid hour, minute or release date",
                    });
                    return [2];
                }
                if (isNaN(+req.body.category) ||
                    !server_global_1.default.getInstance().isValidCategoryValue(+req.body.category)) {
                    server_global_1.default.getInstance().logger.error("<addMovie>: Failed to add movie because invalid category");
                    res.status(400).send({
                        success: false,
                        message: "Please provide valid category",
                    });
                    return [2];
                }
                url = req.protocol + "://" + req.get("host");
                return [4, index_1.Movie.create({
                        title: req.body.title,
                        description: req.body.description,
                        category: +req.body.category,
                        release_date: req.body.release_date,
                        movie_hour_length: req.body.movie_hour_length,
                        movie_minute_length: req.body.movie_minute_length,
                        image_path: url + '/image/' + req.files.image[0].filename,
                        video_path: url + '/video/' + req.files.video[0].filename,
                    })];
            case 2:
                newMovie = _a.sent();
                return [4, newMovie.save()];
            case 3:
                _a.sent();
                server_global_1.default.getInstance().logger.info("<addMovie>: Successfully added movie with id: " + newMovie.id);
                res.status(201).send({
                    success: true,
                    message: "Successfully created a new movie",
                });
                return [2];
            case 4:
                e_1 = _a.sent();
                server_global_1.default.getInstance().logger.error("<addMovie>: Failed to add movie because of server error: " + e_1);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 5: return [2];
        }
    });
}); };
exports.addMovie = addMovie;
var getMovies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryObj, movies, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<getMovies>: Start processing request");
                console.log(req.query.category);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                queryObj = {};
                if (typeof req.query.category !== 'undefined') {
                    queryObj = { where: { category: req.query.category } };
                }
                return [4, index_1.Movie.findAll(queryObj)];
            case 2:
                movies = _a.sent();
                server_global_1.default.getInstance().logger.info("<getMovies>: Successfully got the movies");
                res.status(200).send({
                    success: true,
                    message: "Successfully retrieved movies",
                    data: movies.map(function (movie) { return ({
                        id: movie.id,
                        title: movie.title,
                        description: movie.description,
                        category: movie.category,
                        release_date: movie.release_date,
                        movie_hour_length: movie.movie_hour_length,
                        movie_minute_length: movie.movie_minute_length,
                        image_path: movie.image_path,
                        video_path: movie.video_path,
                    }); }),
                });
                return [2];
            case 3:
                e_2 = _a.sent();
                server_global_1.default.getInstance().logger.error("<getMovies>: Failed to get movies because of server error: " + e_2);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 4: return [2];
        }
    });
}); };
exports.getMovies = getMovies;
var getMovie = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movie, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<getMovie>: Start processing request with movie Id " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, index_1.Movie.findByPk(req.params.id)];
            case 2:
                movie = _a.sent();
                if (!movie) {
                    server_global_1.default.getInstance().logger.error("<getMovie>: Failed to find movie with id " + req.params.id);
                    res.status(400).send({
                        success: false,
                        message: "Could not find movie",
                    });
                    return [2];
                }
                server_global_1.default.getInstance().logger.info("<getMovie>: Successfully got movie with id " + req.params.id);
                res.status(200).send({
                    success: true,
                    message: "Successfully retrieved movie",
                    data: {
                        id: movie.id,
                        title: movie.title,
                        description: movie.description,
                        category: movie.category,
                        release_date: movie.release_date,
                        movie_hour_length: movie.movie_hour_length,
                        movie_minute_length: movie.movie_minute_length,
                        image_path: movie.image_path,
                        video_path: movie.video_path,
                    },
                });
                return [2];
            case 3:
                e_3 = _a.sent();
                server_global_1.default.getInstance().logger.error("<getMovie>: Failed to get movie with id " + req.params.id + " because of server error: " + e_3);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 4: return [2];
        }
    });
}); };
exports.getMovie = getMovie;
var getCategories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        server_global_1.default.getInstance().logger.info("<getCategories>: Start processing request");
        server_global_1.default.getInstance().logger.info("<getCategories>: Successfully processed request");
        res.status(200).send({
            success: true,
            message: "Successfully retrieved categories",
            data: server_global_1.default.getInstance().movieCategories,
        });
        return [2];
    });
}); };
exports.getCategories = getCategories;
var deleteMovie = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movieId, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server_global_1.default.getInstance().logger.info("<deleteMovie>: Start processing request with movie id " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4, index_1.Movie.findByPk(req.params.id)];
            case 2:
                movieId = _a.sent();
                if (!movieId) {
                    server_global_1.default.getInstance().logger.error("<deleteMovie>: Failed to find movie with id " + req.params.id);
                    res.status(400).send({
                        success: false,
                        message: "Could not find movie",
                    });
                    return [2];
                }
                return [4, movieId.destroy()];
            case 3:
                _a.sent();
                server_global_1.default.getInstance().logger.info("<deleteMovie>: Successfully deleted movie with " + req.params.id);
                res.status(200).send({
                    success: true,
                    message: "Successfully deleted movie",
                });
                return [2];
            case 4:
                e_4 = _a.sent();
                server_global_1.default.getInstance().logger.error("<deleteMovie>: Failed to delete movie with id: " + req.params.id + ". because of server error: " + e_4);
                res.status(500).send({
                    success: false,
                    message: "Server error",
                });
                return [2];
            case 5: return [2];
        }
    });
}); };
exports.deleteMovie = deleteMovie;
