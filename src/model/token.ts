import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

import { IDBTokenAttributes } from "./shared/db-table";

interface TokenModel extends Model<IDBTokenAttributes>, IDBTokenAttributes {}

class Token extends Model<TokenModel, IDBTokenAttributes> {}

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
  });
}

export {
  TokenModel,
  Token,
  TokenFactory,
  TokenStatic,
}