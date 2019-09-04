'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_event_responses = sequelize.define('tbl_event_responses', {
    event_response_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    event_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    response: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
      timestamps: false,
    });
  tbl_event_responses.removeAttribute('id');

  tbl_event_responses.associate = function (models) {
    // associations can be defined here
    tbl_event_responses.belongsTo(models.tbl_events, { foreignKey: 'event_id' })
    models.tbl_events.belongsToMany(models.tbl_users, { through: tbl_event_responses, foreignKey: 'event_id' })
    models.tbl_users.belongsToMany(models.tbl_events, { through: tbl_event_responses, foreignKey: 'user_id' })
  };

  return tbl_event_responses;
};