import sequelize from "sequelize";

import { UserFactory } from '../user';
import { MovieFactory } from '../movie';
import { FavoriteMoviesFactory } from '../favoriteMovies';
import { TokenFactory } from '../token';

const instantiateObj = {
    database: process.env.MYSQL_DB_NAME,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
}

const dbConfig = new sequelize.Sequelize(instantiateObj.database, instantiateObj.username, instantiateObj.password, {
        port: Number(instantiateObj.port),
        host: instantiateObj.host,
        dialect: "mysql",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    },
);

const User = UserFactory(dbConfig);
const Movie = MovieFactory(dbConfig);
const FavoriteMovies = FavoriteMoviesFactory(dbConfig);
const Token = TokenFactory(dbConfig);

export {
    dbConfig,
    User,
    Movie,
    FavoriteMovies,
    Token,
}