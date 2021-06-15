'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_admin_companies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_admin_companies.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
      tbl_admin_companies.belongsTo(models.tbl_companys, { foreignKey: 'company_id' })
      tbl_admin_companies.belongsTo(models.tbl_designations, { foreignKey: 'designations_id' })
      tbl_admin_companies.belongsTo(models.tbl_notification_categories, { foreignKey: 'notification_category_id' })
    }
  };
  tbl_admin_companies.init({
    user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    PIC: DataTypes.BOOLEAN,
    designations_id: DataTypes.INTEGER,
    notification_category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_admin_companies',
  });
  return tbl_admin_companies;
};