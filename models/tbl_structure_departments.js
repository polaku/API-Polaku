'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_structure_departments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_structure_departments.belongsTo(models.tbl_departments, { as: "department", foreignKey: 'departments_id' })
      tbl_structure_departments.belongsTo(models.tbl_departments, { as: "section", foreignKey: 'department_section' })
      tbl_structure_departments.belongsTo(models.tbl_companys, { foreignKey: 'company_id' })

      tbl_structure_departments.hasMany(models.tbl_department_positions, { foreignKey: 'structure_department_id' })
      tbl_structure_departments.hasMany(models.tbl_department_teams, { foreignKey: 'structure_department_id' })
      
    }
  };
  tbl_structure_departments.init({
    departments_id: DataTypes.INTEGER,
    hierarchy: DataTypes.INTEGER,
    department_section: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_structure_departments',
  });
  return tbl_structure_departments;
};