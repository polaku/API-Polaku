'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_event_invites = sequelize.define('tbl_event_invites', {
    event_invite_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    event_id: DataTypes.INTEGER,
    option: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    departments_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
      timestamps: false,
    });
  tbl_event_invites.removeAttribute('id');

  tbl_event_invites.associate = function (models) {
    // associations can be defined here
    tbl_event_invites.belongsTo(models.tbl_events, { foreignKey: 'event_id' })
    tbl_event_invites.belongsTo(models.tbl_companys, { foreignKey: 'company_id' })
    tbl_event_invites.belongsTo(models.tbl_departments, { foreignKey: 'departments_id' })
    tbl_event_invites.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
  };

  return tbl_event_invites;
};