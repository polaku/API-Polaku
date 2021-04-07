'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_kpim_scores = sequelize.define('tbl_kpim_scores', {
    kpim_score_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    kpim_id: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    target_monthly: DataTypes.INTEGER,
    pencapaian_monthly: DataTypes.STRING,
    bobot: DataTypes.INTEGER,
    score_kpim_monthly: DataTypes.INTEGER,
    active_flag: DataTypes.BOOLEAN,
    hasConfirm: DataTypes.BOOLEAN,
  }, {
      timestamps: false,
    });
  tbl_kpim_scores.removeAttribute('id');

  tbl_kpim_scores.associate = function (models) {
    // associations can be defined here
    tbl_kpim_scores.belongsTo(models.tbl_kpims, { foreignKey: "kpim_id" })
    tbl_kpim_scores.hasMany(models.tbl_tals, { foreignKey: "kpim_score_id" })
  };

  return tbl_kpim_scores;
};
