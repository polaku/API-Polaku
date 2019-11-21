'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_events = sequelize.define('tbl_events', {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    event_name: DataTypes.STRING,
    description: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    location: DataTypes.STRING,
    color: DataTypes.STRING,
    status: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    keterangan: DataTypes.STRING,
    room_booking_id: DataTypes.INTEGER
  }, {
      timestamps: false,
    });
  tbl_events.removeAttribute('id');

  tbl_events.associate = function (models) {
    // associations can be defined here
    tbl_events.belongsTo(models.tbl_users, { foreignKey: "user_id" })
    tbl_events.hasMany(models.tbl_event_responses, { foreignKey: "event_id" })
    tbl_events.hasMany(models.tbl_event_invites, { foreignKey: "event_id" })
    tbl_events.belongsTo(models.tbl_room_bookings, { foreignKey: "room_booking_id" })
  };

  return tbl_events;
};