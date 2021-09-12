"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFactory = void 0;
var sequelize_1 = require("sequelize");
var TokenFactory = function (sequelize) {
    return sequelize.define("tokens", {
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });
};
exports.TokenFactory = TokenFactory;
