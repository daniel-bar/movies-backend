import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { IDBTokenAttributes } from "./shared/db-table";

interface TokenModel extends Model<Optional<IDBTokenAttributes, 'id' | 'updatedAt' | 'createdAt'>>, IDBTokenAttributes { }

type TokenStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TokenModel;
};

const TokenFactory = (sequelize: Sequelize): TokenStatic => {
  return <TokenStatic>sequelize.define("tokens", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    indexes: [{
      fields: ['user_id'],
    }],
  });
}

export { TokenFactory }