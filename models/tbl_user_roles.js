'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_user_roles = sequelize.define('tbl_user_roles', {
    user_role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    designations_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    view: DataTypes.BOOLEAN,
    created: DataTypes.BOOLEAN,
    edited: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    download: DataTypes.BOOLEAN
  }, {
    timestamps: false,
  });
  tbl_user_roles.removeAttribute('id');

  tbl_user_roles.associate = function (models) {
    // associations can be defined here
    tbl_user_roles.belongsTo(models.tbl_designations, { foreignKey: "designations_id" })
    tbl_user_roles.belongsTo(models.tbl_menus, { foreignKey: "menu_id" })

  };

  return tbl_user_roles;
};