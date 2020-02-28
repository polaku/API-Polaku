'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_account_details = sequelize.define('tbl_account_details', {
    account_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    nik: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    building_id: DataTypes.INTEGER,
    designations_id: DataTypes.INTEGER,
    position_id: DataTypes.INTEGER,
    initial: DataTypes.STRING,
    admin_contact_categori: DataTypes.STRING,
    name_evaluator_1: DataTypes.INTEGER,
    name_evaluator_2: DataTypes.INTEGER,
    leave: DataTypes.INTEGER,
    /*
    locale: DataTypes.STRING,
    address: DataTypes.STRING,
    language: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    direction: DataTypes.STRING,
    dinas: DataTypes.STRING,
    ext: DataTypes.INTEGER,
    */
  }, {
    timestamps: false,
  });
  tbl_account_details.removeAttribute('id');

  tbl_account_details.associate = function (models) {
    // associations can be defined here
    tbl_account_details.belongsTo(models.tbl_users, { as: "userId", foreignKey: "user_id" })
    tbl_account_details.belongsTo(models.tbl_users, { as: "idEvaluator1", foreignKey: "name_evaluator_1" })
    tbl_account_details.belongsTo(models.tbl_users, { as: "idEvaluator2", foreignKey: "name_evaluator_2" })
    tbl_account_details.belongsTo(models.tbl_companys, { foreignKey: "company_id" })
    tbl_account_details.belongsTo(models.tbl_designations, { foreignKey: "designations_id" })
    tbl_account_details.belongsTo(models.tbl_positions, { foreignKey: "position_id" })
  };

  return tbl_account_details;
};