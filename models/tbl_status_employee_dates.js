'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_status_employee_dates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_status_employee_dates.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    }
  };
  tbl_status_employee_dates.init({
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'tbl_status_employee_dates',
  });
  return tbl_status_employee_dates;
};