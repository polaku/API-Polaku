'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_contacts = sequelize.define('tbl_contacts', {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.STRING,
    contact_categories_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    categori_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    created_expired_date: DataTypes.DATE,
    assigned_date: DataTypes.DATE,
    assigned_expired_date: DataTypes.DATE,
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    subject: DataTypes.STRING,
    taken_by: DataTypes.INTEGER,
    taken_date: DataTypes.DATE,
    done_date: DataTypes.DATE,
    done_expired_date: DataTypes.DATE,
    cancel_date: DataTypes.DATE,
    revisi: DataTypes.INTEGER,
    design_style: DataTypes.STRING,
    design_to: DataTypes.STRING,
    design_type: DataTypes.STRING,
    design_size: DataTypes.STRING,
    design_other_specs: DataTypes.STRING,
    design_deadline: DataTypes.DATE,  
    review: DataTypes.STRING,
    date_ijin_absen_start: DataTypes.STRING,
    date_ijin_absen_end: DataTypes.DATE,
    leave_request: DataTypes.INTEGER,
    leave_date: DataTypes.STRING,
    leave_date_in: DataTypes.DATE,
    date_imp: DataTypes.DATE,
    start_time_imp: DataTypes.TIME,
    end_time_imp: DataTypes.TIME,
    evaluator_1: DataTypes.INTEGER,
    evaluator_2: DataTypes.INTEGER,
    cancel_reason: DataTypes.STRING,
    doctor_letter: DataTypes.STRING
  }, {
      timestamps: false,
    });
  tbl_contacts.removeAttribute('id');

  tbl_contacts.associate = function (models) {
    // associations can be defined here
    tbl_contacts.belongsTo(models.tbl_users, { foreignKey: "user_id" })
    tbl_contacts.belongsTo(models.tbl_companys, { foreignKey: "company_id" })
    tbl_contacts.belongsTo(models.tbl_users, { as: "evaluator1", foreignKey: "evaluator_1" })
    tbl_contacts.belongsTo(models.tbl_users, { as: "evaluator2", foreignKey: "evaluator_2" })
    tbl_contacts.belongsTo(models.tbl_contact_categories, { foreignKey: "contact_categories_id" })
    tbl_contacts.belongsTo(models.tbl_categoris, { foreignKey: "categori_id" })
    tbl_contacts.belongsTo(models.tbl_contact_comments, { foreignKey: "categori_id" })
  };

  return tbl_contacts;
};