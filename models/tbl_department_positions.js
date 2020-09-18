'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_department_positions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_department_positions.belongsTo(models.tbl_structure_departments, { foreignKey: 'structure_department_id' })
      tbl_department_positions.belongsTo(models.tbl_positions, { foreignKey: 'position_id' })
      tbl_department_positions.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    }
  };
  tbl_department_positions.init({
    structure_department_id: DataTypes.INTEGER,
    position_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_department_positions',
  });
  return tbl_department_positions;
};