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
    created: DataTypes.DATE,
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
  }, {
      timestamps: false,
    });
  tbl_contacts.removeAttribute('id');

  tbl_contacts.associate = function (models) {
    // associations can be defined here
    tbl_contacts.belongsTo(models.tbl_users, { foreignKey: "user_id" })
    tbl_contacts.belongsTo(models.tbl_contact_categories, { foreignKey: "contact_categories_id" })
  };

  return tbl_contacts;
};