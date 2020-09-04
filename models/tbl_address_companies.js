'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_address_companies = sequelize.define('tbl_address_companies', {
    address: DataTypes.STRING,
    acronym: DataTypes.STRING,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    operationDay: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    is_main_address: DataTypes.BOOLEAN
  }, {});
  tbl_address_companies.associate = function (models) {
    // associations can be defined here
    tbl_address_companies.belongsTo(models.tbl_companys, { foreignKey: 'company_id' })

    tbl_address_companies.hasMany(models.tbl_operation_hours, { foreignKey: 'address_id' })
    tbl_address_companies.hasMany(models.tbl_photo_address, { foreignKey: 'address_id' })
    tbl_address_companies.hasMany(models.tbl_recess, { foreignKey: 'address_id' })
  };
  return tbl_address_companies;
};