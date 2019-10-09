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
    // host: DataTypes.STRING,
    // username: DataTypes.STRING,
    // password: DataTypes.STRING,
    // mailbox: DataTypes.STRING,
    // unread_email: DataTypes.INTEGER,
    // delete_mail_after_import: DataTypes.INTEGER,
    // last_postmaster_run: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_designations.removeAttribute('id');

  tbl_designations.associate = function (models) {
    // associations can be defined here
    tbl_designations.belongsTo(models.tbl_departments, { foreignKey: "departments_id" })
    // tbl_designations.hasMany(models.tbl_buildings, { foreignKey: "company_id" })
  };

  return tbl_designations;
};
