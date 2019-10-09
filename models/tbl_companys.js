'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_companys = sequelize.define('tbl_companys', {
    company_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    company_name: DataTypes.STRING,
    company_logo: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_companys.removeAttribute('id');

  tbl_companys.associate = function (models) {
    // associations can be defined here
    tbl_companys.hasMany(models.tbl_account_details, { foreignKey: "company_id" })
    tbl_companys.hasMany(models.tbl_buildings, { foreignKey: "company_id" })
  };

  return tbl_companys;
};
