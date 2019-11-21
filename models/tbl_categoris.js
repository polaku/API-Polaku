'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_categoris = sequelize.define('tbl_categoris', {
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
  tbl_categoris.removeAttribute('id');

  tbl_categoris.associate = function (models) {
    // associations can be defined here
    tbl_categoris.belongsTo(models.tbl_contact_categories, { foreignKey: "contact_categories_id" })
    tbl_categoris.hasMany(models.tbl_contacts, { foreignKey: "categori_id" })
  };

  return tbl_categoris;
};