import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

import { IDBMoviesAttributes } from "./shared/db-table";

interface MovieModel extends Model<IDBMoviesAttributes>, IDBMoviesAttributes {}

class Movie extends Model<MovieModel, IDBMoviesAttributes> {}

type MovieStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MovieModel;
};

const MovieFactory = (sequelize: Sequelize): MovieStatic => {
  return <MovieStatic>sequelize.define("movies", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(280),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    release_date: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    movie_hour_length: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    movie_minute_length: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING(2083),
      allowNull: false,
    },
    video_length: {
      type: DataTypes.STRING(2083),
      allowNull: false,
    },
  });
}

export {
  Movie,
  MovieFactory,
}