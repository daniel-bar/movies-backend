"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.FavoriteMovies = exports.Movie = exports.User = exports.dbConfig = void 0;
var sequelize_1 = __importDefault(require("sequelize"));
var user_1 = require("../user");
var movie_1 = require("../movie");
var favoriteMovies_1 = require("../favoriteMovies");
var token_1 = require("../token");
var instantiateObj = {
    database: process.env.MYSQL_DB_NAME,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
};
var dbConfig = new sequelize_1.default.Sequelize(instantiateObj.database, instantiateObj.username, instantiateObj.password, {
    port: Number(instantiateObj.port),
    host: instantiateObj.host,
    dialect: "mysql",
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000,
    },
});
exports.dbConfig = dbConfig;
var User = (0, user_1.UserFactory)(dbConfig);
exports.User = User;
var Movie = (0, movie_1.MovieFactory)(dbConfig);
exports.Movie = Movie;
var FavoriteMovies = (0, favoriteMovies_1.FavoriteMoviesFactory)(dbConfig);
exports.FavoriteMovies = FavoriteMovies;
var Token = (0, token_1.TokenFactory)(dbConfig);
exports.Token = Token;
