'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_locations = sequelize.define('tbl_locations', {
    location_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    location: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_locations.removeAttribute('id');

  tbl_locations.associate = function (models) {
    // associations can be defined here
    tbl_locations.hasMany(models.tbl_rooms, { foreignKey: "location_id" })
    tbl_locations.hasMany(models.tbl_buildings, { foreignKey: "location_id" })
  };

  return tbl_locations;
};
