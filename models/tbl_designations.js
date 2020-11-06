'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_designations = sequelize.define('tbl_designations', {
    designations_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    departments_id: DataTypes.INTEGER,
    designations: DataTypes.STRING,
    permission: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_designations.removeAttribute('id');

  tbl_designations.associate = function (models) {
    // associations can be defined here
    tbl_designations.belongsTo(models.tbl_departments, { foreignKey: "departments_id" })
    tbl_designations.hasMany(models.tbl_user_roles, { foreignKey: "designations_id" })
  };

  return tbl_designations;
};
