"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieFactory = void 0;
var sequelize_1 = require("sequelize");
var MovieFactory = function (sequelize) {
    return sequelize.define("movies", {
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 26],
            },
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 280],
            },
        },
        category: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            allowNull: false,
        },
        release_date: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        movie_hour_length: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        movie_minute_length: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        image_path: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        video_path: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    });
};
exports.MovieFactory = MovieFactory;
