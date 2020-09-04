'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_PICs = sequelize.define('tbl_PICs', {
    company_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  tbl_PICs.associate = function(models) {
    // associations can be defined here
    tbl_PICs.belongsTo(models.tbl_companys, {foreignKey : 'company_id'})
    tbl_PICs.belongsTo(models.tbl_users, {foreignKey: 'user_id'})
  };
  return tbl_PICs;
};