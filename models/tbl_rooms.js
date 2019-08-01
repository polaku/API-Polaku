'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_rooms = sequelize.define('tbl_rooms', {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    room: DataTypes.STRING,
    max: DataTypes.INTEGER,
    // fasilities: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_rooms.removeAttribute('id');

  tbl_rooms.associate = function (models) {
    // associations can be defined here
    tbl_rooms.hasMany(models.tbl_room_bookings, { foreignKey: "room_id" })
  };

  return tbl_rooms;
};