'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_room_bookings = sequelize.define('tbl_room_bookings', {
    room_booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    room_id: DataTypes.INTEGER,
    date_in: DataTypes.DATE,
    time_in: DataTypes.TIME,
    time_out: DataTypes.TIME,
    subject: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    time: DataTypes.TIME,
    count: DataTypes.INTEGER,
  }, {
      timestamps: false,
    });
  tbl_room_bookings.removeAttribute('id');

  tbl_room_bookings.associate = function (models) {
    // associations can be defined here
    // tbl_room_bookings.belongsTo(models.User, {foreignKey : "user_id"})
  };

  return tbl_room_bookings;
};