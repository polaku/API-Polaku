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
    date_of_birth: DataTypes.DATE,
    address: DataTypes.STRING,
    nickname: DataTypes.STRING,
    departments_id: DataTypes.INTEGER,
    status_employee: DataTypes.STRING,
    join_date: DataTypes.DATE,
    start_leave_big: DataTypes.DATE,
    leave_big: DataTypes.INTEGER,
    next_frame_date: DataTypes.DATE,
    next_lensa_date: DataTypes.DATE,
    office_email: DataTypes.STRING,
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
    tbl_account_details.belongsTo(models.tbl_departments, { foreignKey: "departments_id" })
    tbl_account_details.belongsTo(models.tbl_buildings, { foreignKey: "building_id" })
  };

  return tbl_account_details;
};