'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_contact_comments = sequelize.define('tbl_contact_comments', {
    contact_comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    contact_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
      timestamps: false,
    });
  tbl_contact_comments.removeAttribute('id');

  tbl_contact_comments.associate = function (models) {
    // associations can be defined here
    tbl_contact_comments.belongsTo(models.tbl_contacts, { foreignKey: "contact_id" })
    tbl_contact_comments.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_contact_comments;
};