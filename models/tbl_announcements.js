'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_announcements = sequelize.define('tbl_announcements', {
    announcements_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('published', 'unpublished'),
    view_status: DataTypes.INTEGER,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    all_client: DataTypes.STRING,
    attachment: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_announcements.removeAttribute('id');

  tbl_announcements.associate = function (models) {
    // associations can be defined here
    // tbl_announcements.belongsTo(models.User, {foreignKey : "user_id"})
  };

  return tbl_announcements;
};