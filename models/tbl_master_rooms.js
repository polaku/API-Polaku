'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_master_rooms = sequelize.define('tbl_master_rooms', {
    master_room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    company_id: DataTypes.STRING,
    chief: DataTypes.INTEGER,
    room_id: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_master_rooms.removeAttribute('id');

  tbl_master_rooms.associate = function (models) {
    // associations can be defined here
    tbl_master_rooms.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_master_rooms;
};
