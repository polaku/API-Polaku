'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_notification_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_notification_categories.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
      tbl_notification_categories.hasMany(models.tbl_admin_companies, { foreignKey: 'notification_category_id' })
    }
  };
  tbl_notification_categories.init({
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_notification_categories',
  });
  return tbl_notification_categories;
};