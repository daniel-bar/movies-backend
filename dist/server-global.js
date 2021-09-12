"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieCategory = void 0;
var path_1 = __importDefault(require("path"));
var winston_1 = __importDefault(require("winston"));
var topic_1 = require("./model/shared/topic");
var MovieCategory;
(function (MovieCategory) {
    MovieCategory[MovieCategory["Action"] = 1] = "Action";
    MovieCategory[MovieCategory["Comedy"] = 2] = "Comedy";
    MovieCategory[MovieCategory["Drama"] = 3] = "Drama";
    MovieCategory[MovieCategory["Fantasy"] = 4] = "Fantasy";
    MovieCategory[MovieCategory["Horror"] = 5] = "Horror";
    MovieCategory[MovieCategory["Mystery"] = 6] = "Mystery";
    MovieCategory[MovieCategory["Romance"] = 7] = "Romance";
    MovieCategory[MovieCategory["Thriller"] = 8] = "Thriller";
    MovieCategory[MovieCategory["Western"] = 9] = "Western";
})(MovieCategory = exports.MovieCategory || (exports.MovieCategory = {}));
;
var ServerGlobal = (function () {
    function ServerGlobal() {
        this._logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({
                    filename: path_1.default.join(__dirname, '../logs.log'),
                    level: 'info',
                }),
            ],
        });
        this._movieCategories = [
            { value: MovieCategory.Action, label: 'Action' },
            { value: MovieCategory.Comedy, label: 'Comedy' },
            { value: MovieCategory.Drama, label: 'Drama' },
            { value: MovieCategory.Fantasy, label: 'Fantasy' },
            { value: MovieCategory.Horror, label: 'Horror' },
            { value: MovieCategory.Mystery, label: 'Mystery' },
            { value: MovieCategory.Romance, label: 'Romance' },
            { value: MovieCategory.Thriller, label: 'Thriller' },
            { value: MovieCategory.Western, label: 'Western' },
        ];
        this._contactTopics = [
            { value: topic_1.Topic.Delivery, label: 'Delivery' },
            { value: topic_1.Topic.OrderIssues, label: 'Order Issues' },
            { value: topic_1.Topic.ReturnsAndRefunds, label: 'Returns and Refunds' },
            { value: topic_1.Topic.Technical, label: 'Technical' },
        ];
    }
    ServerGlobal.getInstance = function () {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new ServerGlobal();
        return this._instance;
    };
    Object.defineProperty(ServerGlobal.prototype, "movieCategories", {
        get: function () {
            return __spreadArray([], this._movieCategories, true);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerGlobal.prototype, "movieCategoriesValues", {
        get: function () {
            return this._movieCategories.map(function (movieCategory) { return movieCategory.value; });
        },
        enumerable: false,
        configurable: true
    });
    ServerGlobal.prototype.getCategoryLabel = function (value) {
        var matcingCategory = this._movieCategories.find(function (movieCategory) { return movieCategory.value === value; });
        if (!matcingCategory) {
            return null;
        }
        return matcingCategory.label;
    };
    ServerGlobal.prototype.isValidCategoryValue = function (value) {
        return !!this._movieCategories.find(function (movieCategory) { return movieCategory.value === value; });
    };
    ServerGlobal.prototype.getContactTopicLabel = function (value) {
        var matchingTopic = this._contactTopics.find(function (contactTopic) { return contactTopic.value === value; });
        if (!matchingTopic) {
            return null;
        }
        return matchingTopic.label;
    };
    Object.defineProperty(ServerGlobal.prototype, "contactTopics", {
        get: function () {
            return __spreadArray([], this._contactTopics, true);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerGlobal.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: false,
        configurable: true
    });
    return ServerGlobal;
}());
exports.default = ServerGlobal;
