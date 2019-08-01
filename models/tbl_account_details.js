'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_account_details = sequelize.define('tbl_account_details', {
    account_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    /*
    nik: DataTypes.STRING,
    locale: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    language: DataTypes.STRING,
    designations_id: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    company_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    building_id: DataTypes.INTEGER,
    initial: DataTypes.STRING,
    name_evaluator_1: DataTypes.STRING,
    name_evaluator_2: DataTypes.STRING,
    direction: DataTypes.STRING,
    dinas: DataTypes.STRING,
    position_id: DataTypes.INTEGER,
    ext: DataTypes.INTEGER,
    */
  }, {
      timestamps: false,
    });
  tbl_account_details.removeAttribute('id');

  tbl_account_details.associate = function (models) {
    // associations can be defined here
    tbl_account_details.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_account_details;
};