'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_dinas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_dinas.belongsTo(models.tbl_users, { as: 'evaluator', foreignKey: "evaluator_id" })
      tbl_dinas.belongsTo(models.tbl_users, { as: 'dinas', foreignKey: "user_id" })
      tbl_dinas.belongsTo(models.tbl_companys, { foreignKey: "company_id" })
      tbl_dinas.belongsTo(models.tbl_buildings, { foreignKey: "building_id" })
    }
  };
  tbl_dinas.init({
    company_id: DataTypes.INTEGER,
    building_id: DataTypes.INTEGER,
    evaluator_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'tbl_dinas',
  });
  return tbl_dinas;
};