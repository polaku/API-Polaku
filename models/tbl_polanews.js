'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_polanews = sequelize.define('tbl_polanews', {
    polanews_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    attachments: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    status: DataTypes.INTEGER,
    total_view: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_polanews.removeAttribute('id');

  tbl_polanews.associate = function (models) {
    // associations can be defined here
    tbl_polanews.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_polanews;
};