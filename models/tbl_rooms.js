'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_rooms = sequelize.define('tbl_rooms', {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    room: DataTypes.STRING,
    max: DataTypes.INTEGER,
    facilities: DataTypes.STRING,
		thumbnail: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    building_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    open_gate: DataTypes.TIME, 
    close_gate: DataTypes.TIME 
  }, {
      timestamps: false,
    });
  tbl_rooms.removeAttribute('id');

  tbl_rooms.associate = function (models) {
    // associations can be defined here
    tbl_rooms.hasMany(models.tbl_room_bookings, { foreignKey: "room_id" })
    tbl_rooms.belongsTo(models.tbl_buildings, { foreignKey: "building_id" })
    tbl_rooms.belongsTo(models.tbl_locations, { foreignKey: "location_id" })
  };

  return tbl_rooms;
};
