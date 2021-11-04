import Sequelize, { Optional } from "sequelize";
import ServerGlobal from "../server-global";

import IDBAttribute from "./shared/db-table";

interface IFavoriteMoviesAttributes extends IDBAttribute {
    readonly movie_id: number;
    readonly user_id: number;
}

class FavoriteMovie extends Sequelize.Model<Optional<IFavoriteMoviesAttributes, 'id' | 'createdAt' | 'updatedAt'>> implements IFavoriteMoviesAttributes {
  public id!: number;
  public movie_id!: number;
  public user_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FavoriteMovie.init({
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  movie_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  tableName: 'favorite_movies',
  sequelize: ServerGlobal.getInstance().db,
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

export default FavoriteMovie;