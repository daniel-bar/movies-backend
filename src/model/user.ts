import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

import { IDBUserAttributes } from "./shared/db-table";

interface UserModel extends Model<IDBUserAttributes>, IDBUserAttributes {}

class User extends Model<UserModel, IDBUserAttributes> {}

type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

const UserFactory = (sequelize: Sequelize): UserStatic => {
  return <UserStatic>sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
}

export {
  UserModel,
  User,
  UserFactory,
  UserStatic,
}