'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_activity_logins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_activity_logins.init({
    user_id: DataTypes.INTEGER,
    os: DataTypes.STRING,
    browser: DataTypes.STRING,
    ip: DataTypes.STRING,
    last_login: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
    page: DataTypes.STRING,
    action: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_activity_logins',
  });
  return tbl_activity_logins;
};