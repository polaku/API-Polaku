'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_menus = sequelize.define('tbl_menus', {
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    label: DataTypes.STRING,
    link: DataTypes.STRING,
    icon: DataTypes.STRING,
    parent: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    time: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    timestamps: false,
  });
  tbl_menus.removeAttribute('id');

  tbl_menus.associate = function (models) {
    // associations can be defined here
    tbl_menus.hasMany(models.tbl_user_roles, { foreignKey: "menu_id" })
  };

  return tbl_menus;
};