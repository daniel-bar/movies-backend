import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { IDBFavoriteMoviesAttributes } from "./shared/db-table";

interface FavoriteMoviesModel extends Model<Optional<IDBFavoriteMoviesAttributes, 'movie_id' | 'id' | 'updatedAt' | 'createdAt'>>, IDBFavoriteMoviesAttributes {}

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
  },
  {
    indexes: [
      {
        name: 'favorite_movies_user_id_movie_id_index',
        using: 'BTREE',
        fields: [
          'user_id',
          'movie_id',
        ],
        unique: true,
      },
    ],
  });
}

export { FavoriteMoviesFactory };