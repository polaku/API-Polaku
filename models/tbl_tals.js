'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_tals = sequelize.define('tbl_tals', {
    tal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    indicator_tal: DataTypes.STRING,
    kpim_score_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    order_by_user: DataTypes.INTEGER,
    order_by_company: DataTypes.INTEGER,
    type: DataTypes.STRING,
    order_by_user: DataTypes.INTEGER,
    order_by_company: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
  tbl_tals.removeAttribute('id');

  tbl_tals.associate = function (models) {
    // associations can be defined here
    tbl_tals.belongsTo(models.tbl_users, { as: 'user', foreignKey: "user_id" })
    tbl_tals.belongsTo(models.tbl_users, { as: 'order_by', foreignKey: "order_by_user" })
    tbl_tals.belongsTo(models.tbl_companys, { foreignKey: "order_by_company" })
    tbl_tals.belongsTo(models.tbl_users, { foreignKey: "user_id" })
    tbl_tals.belongsTo(models.tbl_kpim_scores, { foreignKey: "kpim_score_id" })
    tbl_tals.hasMany(models.tbl_tal_scores, { foreignKey: "tal_id" })
  };

  return tbl_tals;
};
