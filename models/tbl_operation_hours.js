'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_operation_hours = sequelize.define('tbl_operation_hours', {
    day: DataTypes.STRING,
    start: DataTypes.TIME,
    end: DataTypes.TIME,
    address_id: DataTypes.INTEGER
  }, {});
  tbl_operation_hours.associate = function(models) {
    // associations can be defined here
    tbl_operation_hours.belongsTo(models.tbl_address_companies, { foreignKey: 'address_id' })
  };
  return tbl_operation_hours;
};