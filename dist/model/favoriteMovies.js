"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteMoviesFactory = void 0;
var sequelize_1 = require("sequelize");
var FavoriteMoviesFactory = function (sequelize) {
    return sequelize.define("favorite_movies", {
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        movie_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    });
};
exports.FavoriteMoviesFactory = FavoriteMoviesFactory;
