'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_team_positions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_team_positions.belongsTo(models.tbl_department_teams, { foreignKey: 'department_team_id' })
      tbl_team_positions.belongsTo(models.tbl_positions, { foreignKey: 'position_id' })
      tbl_team_positions.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    }
  };
  tbl_team_positions.init({
    department_team_id: DataTypes.INTEGER,
    position_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_team_positions',
  });
  return tbl_team_positions;
};