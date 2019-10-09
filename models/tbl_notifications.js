'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_notifications = sequelize.define('tbl_notifications', {
    notifications_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    read: DataTypes.INTEGER,
    read_inline: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    description: DataTypes.STRING,
    from_user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    icon: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_notifications.removeAttribute('id');

  tbl_notifications.associate = function (models) {
    // associations can be defined here
    tbl_notifications.belongsTo(models.tbl_users, { as: 'from_user', foreignKey: "from_user_id" })
    tbl_notifications.belongsTo(models.tbl_users, { as: 'to_user', foreignKey: "to_user_id" })
  };

  return tbl_notifications;
};
