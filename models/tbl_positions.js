'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_positions = sequelize.define('tbl_positions', {
    position_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    position: DataTypes.STRING,
  }, {
      timestamps: false,
    });
  tbl_positions.removeAttribute('id');

  tbl_positions.associate = function (models) {
    // associations can be defined here
    tbl_positions.hasMany(models.tbl_account_details, { foreignKey: "position_id" })
    tbl_positions.hasMany(models.tbl_department_positions, { foreignKey: 'position_id' })
    tbl_positions.hasMany(models.tbl_team_positions, { foreignKey: 'position_id' })
  };

  return tbl_positions;
};