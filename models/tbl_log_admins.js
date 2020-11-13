'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_log_admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_log_admins.init({
    employee: DataTypes.STRING,
    admin: DataTypes.STRING,
    company: DataTypes.STRING,
    action: DataTypes.STRING,
    action_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_log_admins',
  });
  return tbl_log_admins;
};