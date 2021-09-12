"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyKeys = void 0;
var server_global_1 = __importDefault(require("../server-global"));
var bodyKeys = function (fields) {
    return function (req, res, next) {
        var keys = Object.keys(req.body);
        var invalidFields = [];
        var _loop_1 = function (field) {
            var key = keys.find(function (key) { return field.key === key; });
            if (!key || field.type !== typeof req.body[key]) {
                invalidFields.push(field);
                return "continue";
            }
        };
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            _loop_1(field);
        }
        if (!!invalidFields.length) {
            var fieldsList = invalidFields.map(function (field) { return field.key + " (" + field.type + ")"; });
            server_global_1.default.getInstance().logger.error("Got a request for " + req.url + " but missed the body keys: " + fieldsList.join(', '));
            return res.status(406).json({
                success: false,
                message: "Please provide " + fieldsList.join(', ') + ".",
            });
        }
        next();
    };
};
exports.bodyKeys = bodyKeys;
