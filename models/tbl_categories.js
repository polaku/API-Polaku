'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_categories = sequelize.define('tbl_categories', {
    categori_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    contact_categories_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    sub_categori: DataTypes.STRING
  }, {
      timestamps: false,
    });
  tbl_categories.removeAttribute('id');

  tbl_categories.associate = function (models) {
    // associations can be defined here
    tbl_categories.belongsTo(models.tbl_contact_categories, { foreignKey: "contact_categories_id" })
    tbl_categories.hasMany(models.tbl_contacts, { foreignKey: "categori_id" })
  };

  return tbl_categories;
};