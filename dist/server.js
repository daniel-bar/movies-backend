"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var debug_1 = __importDefault(require("debug"));
var app_1 = __importDefault(require("./app"));
var server_global_1 = __importDefault(require("./server-global"));
var shared_1 = require("./model/shared");
var index_1 = require("./model/shared/index");
var debug = (0, debug_1.default)('node-angular');
var normalizePort = function (val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return null;
};
var onError = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var addr = server.address();
    var bind = typeof addr === 'string' ? ('pipe ' + addr) : ('port ' + port);
    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
var onListening = function () {
    var addr = server.address();
    var bind = typeof addr === 'string' ? ('pipe ' + addr) : ('port ' + port);
    debug("Listening on " + bind);
};
var port = normalizePort(process.env.PORT);
app_1.default.set('port', port);
var server = http_1.default.createServer(app_1.default);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
index_1.FavoriteMovies.belongsTo(index_1.User, { constraints: true, onDelete: 'CASCADE' });
index_1.Token.belongsTo(index_1.User, { constraints: true, onDelete: 'CASCADE' });
shared_1.dbConfig.sync()
    .then(function () {
    server_global_1.default.getInstance().logger.info('MySQL database connection done successfully');
})
    .catch(function (e) {
    server_global_1.default.getInstance().logger.error("MySQL database connection has failed with error: " + e);
});
server_global_1.default.getInstance().logger.info("Server is running on port " + process.env.PORT);
