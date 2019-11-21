'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_contact_categories = sequelize.define('tbl_contact_categories', {
    contact_categories_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    contact_categories: DataTypes.STRING
  }, {
      timestamps: false,
    });
  tbl_contact_categories.removeAttribute('id');

  tbl_contact_categories.associate = function (models) {
    // associations can be defined here
    tbl_contact_categories.hasMany(models.tbl_categoris, { foreignKey: "contact_categories_id" })
    tbl_contact_categories.hasMany(models.tbl_contacts, { foreignKey: "contact_categories_id" })
  };

  return tbl_contact_categories;
};