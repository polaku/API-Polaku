'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_buildings = sequelize.define('tbl_buildings', {
    building_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    building: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    acronym: DataTypes.STRING
  }, {
      timestamps: false,
    });
  tbl_buildings.removeAttribute('id');

  tbl_buildings.associate = function (models) {
    // associations can be defined here
    tbl_buildings.belongsTo(models.tbl_companys, { foreignKey: "company_id" })
    tbl_buildings.belongsTo(models.tbl_locations, { foreignKey: "location_id" })
    tbl_buildings.hasMany(models.tbl_rooms, { foreignKey: "building_id" })
    tbl_buildings.hasMany(models.tbl_address_companies, { foreignKey: "building_id" })
    tbl_buildings.hasMany(models.tbl_account_details, { foreignKey: "building_id" })
    tbl_buildings.hasMany(models.tbl_dinas, { foreignKey: "building_id" })
  };

  return tbl_buildings;
};
