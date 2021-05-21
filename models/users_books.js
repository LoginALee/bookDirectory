"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users_Books extends Model {
    static associate(models) {}
  }
  Users_Books.init(
    {
      userId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Users_Books",
    }
  );
  return Users_Books;
};
