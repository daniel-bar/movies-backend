"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
var sequelize_1 = require("sequelize");
var UserFactory = function (sequelize) {
    return sequelize.define("users", {
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [3, 320],
            },
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 26],
            },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 7,
            },
        },
    });
};
exports.UserFactory = UserFactory;
