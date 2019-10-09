'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_master_creators = sequelize.define('tbl_master_creators', {
    master_creator_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    chief: DataTypes.INTEGER,
  }, {
      timestamps: false,
    });
  tbl_master_creators.removeAttribute('id');

  tbl_master_creators.associate = function (models) {
    // associations can be defined here
    tbl_master_creators.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    tbl_master_creators.belongsTo(models.tbl_users, { as: 'idChief', foreignKey: 'chief' })
  };

  return tbl_master_creators;
};
