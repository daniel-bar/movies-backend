import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

import { IDBFavoriteMoviesAttributes } from "./shared/db-table";

interface FavoriteMoviesModel extends Model<IDBFavoriteMoviesAttributes>, IDBFavoriteMoviesAttributes {}

type FavoriteMoviesStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): FavoriteMoviesModel;
};

const FavoriteMoviesFactory = (sequelize: Sequelize): FavoriteMoviesStatic => {
  return <FavoriteMoviesStatic>sequelize.define("favorite_movies", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    movie_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
}

export { FavoriteMoviesFactory }