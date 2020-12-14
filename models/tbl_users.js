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
    flag_password: DataTypes.INTEGER,
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
    tbl_users.hasMany(models.tbl_contacts, { as: "evaluator1", foreignKey: "evaluator_1" })
    tbl_users.hasMany(models.tbl_contacts, { as: "evaluator2", foreignKey: "evaluator_2" })
    tbl_users.hasMany(models.tbl_events, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_polanews, { foreignKey: "user_id" })
    tbl_users.hasOne(models.tbl_account_details, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_account_details, { as: "idEvaluator1", foreignKey: "name_evaluator_1" })
    tbl_users.hasMany(models.tbl_account_details, { as: "idEvaluator2", foreignKey: "name_evaluator_2" })
    tbl_users.hasMany(models.tbl_event_responses, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_master_rooms, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_master_creators, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_master_creators, { as: 'idChief', foreignKey: "chief" })
    tbl_users.hasMany(models.tbl_notifications, { as: 'from_user', foreignKey: "from_user_id" })
    tbl_users.hasMany(models.tbl_notifications, { as: 'to_user', foreignKey: "to_user_id" })
    tbl_users.hasMany(models.tbl_contact_comments, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_kritik_sarans, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_kpims, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_reward_kpims, { foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_PICs, { foreignKey: 'user_id' })
    tbl_users.hasMany(models.tbl_department_positions, { foreignKey: 'user_id' })
    tbl_users.hasMany(models.tbl_department_teams, { foreignKey: 'report_to' })
    tbl_users.hasMany(models.tbl_team_positions, { foreignKey: 'user_id' })
    tbl_users.hasMany(models.tbl_dinas, { as: 'evaluator', foreignKey: "evaluator_id" })
    tbl_users.hasMany(models.tbl_dinas, { as: 'dinas', foreignKey: "user_id" })
    tbl_users.hasMany(models.tbl_activity_logins, { foreignKey: 'user_id' })
  };

  return tbl_users;
};