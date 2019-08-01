'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_users = sequelize.define('tbl_users', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    activated: DataTypes.INTEGER,
    /*
    banned: DataTypes.INTEGER,
    ban_reason: DataTypes.STRING,
    new_password_key: DataTypes.STRING,
    new_password_requested: DataTypes.DATE,
    new_email: DataTypes.STRING,
    new_email_key: DataTypes.STRING,
    last_ip: DataTypes.STRING,
    last_login: DataTypes.DATE,
    created: DataTypes.DATE,
    modified: DataTypes.DATE,
    online_time: DataTypes.INTEGER,
    permission: DataTypes.STRING,
    active_email: DataTypes.STRING,
    smtp_email_type: DataTypes.STRING,
    smtp_encription: DataTypes.STRING,
    smtp_action: DataTypes.STRING,
    smtp_host_name: DataTypes.STRING,
    smtp_username: DataTypes.STRING,
    smtp_password: DataTypes.STRING,
    smtp_port: DataTypes.STRING,
    smtp_additional_flag: DataTypes.STRING,
    last_postmaster_run: DataTypes.STRING,
    media_path_slug: DataTypes.STRING,
    flag_password: DataTypes.INTEGER
    */
  }, {
      timestamps: false,
    });
  tbl_users.removeAttribute('id');

  tbl_users.associate = function (models) {
    // associations can be defined here
    tbl_users.hasMany(models.tbl_announcements, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_room_bookings, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_contacts, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_events, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_polanews, { foreignKey: "user_id" })
    tbl_users.hasOne(models.tbl_account_details, { foreignKey: "user_id" })
  };

  return tbl_users;
};