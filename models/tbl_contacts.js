'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_contacts = sequelize.define('tbl_contacts', {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.STRING,
    contact_categories_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created: DataTypes.DATE
  }, {
      timestamps: false,
    });
  tbl_contacts.removeAttribute('id');

  tbl_contacts.associate = function (models) {
    // associations can be defined here
    tbl_contacts.belongsTo(models.tbl_users, { foreignKey: "user_id" })
    tbl_contacts.belongsTo(models.tbl_contact_categories, { foreignKey: "contact_categories_id" })
  };

  return tbl_contacts;
};