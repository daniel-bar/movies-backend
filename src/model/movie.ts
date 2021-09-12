import { 
  BuildOptions, 
  DataTypes, 
  Model, 
  Optional, 
  Sequelize,
} from "sequelize";

import { IDBMoviesAttributes } from "./shared/db-table";


interface MovieModel extends Model<Optional<IDBMoviesAttributes, 'id' | 'updatedAt' | 'createdAt'>>, IDBMoviesAttributes { }

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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 26],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 280],
      },
    },
    category: {
      type: DataTypes.ENUM,
      values: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

export { 
  MovieFactory,
  MovieModel,
}