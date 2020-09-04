'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_photo_address = sequelize.define('tbl_photo_address', {
    path: DataTypes.STRING,
    address_id: DataTypes.INTEGER
  }, {});
  tbl_photo_address.associate = function(models) {
    // associations can be defined here
    tbl_photo_address.belongsTo(models.tbl_address_companies, { foreignKey: 'address_id' })
  };
  return tbl_photo_address;
};