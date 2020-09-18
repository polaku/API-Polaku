'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_department_teams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_department_teams.belongsTo(models.tbl_structure_departments, { foreignKey: 'structure_department_id' })
      tbl_department_teams.belongsTo(models.tbl_users, { foreignKey: 'report_to' })

      tbl_department_teams.hasMany(models.tbl_team_positions, { foreignKey: 'department_team_id' })
    }
  };
  tbl_department_teams.init({
    name: DataTypes.STRING,
    structure_department_id: DataTypes.INTEGER,
    report_to: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_department_teams',
  });
  return tbl_department_teams;
};