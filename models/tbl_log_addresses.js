'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_log_addresses = sequelize.define('tbl_log_addresses', {
    address: DataTypes.STRING,
    company: DataTypes.STRING,
    action: DataTypes.STRING,
    action_by: DataTypes.STRING
  }, {});
  tbl_log_addresses.associate = function(models) {
    // associations can be defined here
  };
  return tbl_log_addresses;
};