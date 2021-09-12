import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { IDBUserAttributes } from "./shared/db-table";

interface UserModel extends Model<Optional<IDBUserAttributes, 'id' | 'updatedAt' | 'createdAt'>>, IDBUserAttributes { }

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
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3, 320],
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 26],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 7, 
      },
    },
  });
}

export { 
  UserFactory,
  UserModel, 
}