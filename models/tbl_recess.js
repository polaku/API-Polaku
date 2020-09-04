'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_recess = sequelize.define('tbl_recess', {
    day: DataTypes.STRING,
    start: DataTypes.TIME,
    end: DataTypes.TIME,
    address_id: DataTypes.INTEGER
  }, {});
  tbl_recess.associate = function(models) {
    // associations can be defined here
    tbl_recess.belongsTo(models.tbl_address_companies, { foreignKey: 'address_id' })
  };
  return tbl_recess;
};