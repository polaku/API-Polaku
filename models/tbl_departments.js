'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_departments = sequelize.define('tbl_departments', {
    departments_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    deptname: DataTypes.STRING,
    // department_head_id: DataTypes.STRING,
    // email: DataTypes.STRING,
    // encryption: DataTypes.STRING,
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
  tbl_departments.removeAttribute('id');

  tbl_departments.associate = function (models) {
    // associations can be defined here
    // tbl_departments.hasMany(models.tbl_account_details, { foreignKey: "company_id" })
    // tbl_departments.hasMany(models.tbl_buildings, { foreignKey: "company_id" })
  };

  return tbl_departments;
};
