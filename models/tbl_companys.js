'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_companys = sequelize.define('tbl_companys', {
    company_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    company_name: DataTypes.STRING,
    company_logo: DataTypes.STRING,
    acronym: DataTypes.STRING
  }, {
    timestamps: false,
  });
  tbl_companys.removeAttribute('id');

  tbl_companys.associate = function (models) {
    // associations can be defined here
    tbl_companys.hasMany(models.tbl_account_details, { as: 'tbl_company', foreignKey: "company_id" })
    tbl_companys.hasMany(models.tbl_account_details, { as: 'companyKPI', foreignKey: "company_KPI" })
    tbl_companys.hasMany(models.tbl_account_details, { as: 'companyHRD', foreignKey: "company_HRD" })
    tbl_companys.hasMany(models.tbl_buildings, { foreignKey: "company_id" })
    tbl_companys.hasMany(models.tbl_contacts, { foreignKey: "company_id" })
    tbl_companys.hasMany(models.tbl_PICs, { foreignKey: "company_id" })
    tbl_companys.hasMany(models.tbl_address_companies, { foreignKey: 'company_id' })
    tbl_companys.belongsTo(models.tbl_structure_departments, { foreignKey: 'company_id' })
    tbl_companys.belongsTo(models.tbl_admin_companies, { foreignKey: 'company_id' })
  };

  return tbl_companys;
};
