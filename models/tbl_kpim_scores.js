'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_kpim_scores = sequelize.define('tbl_kpim_scores', {
    kpim_score_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    kpim_id: DataTypes.INTEGER,
    month: DataTypes.STRING,
    target_monthly: DataTypes.INTEGER,
    pencapaian_monthly: DataTypes.INTEGER,
    bobot: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    active_flag: DataTypes.BOOLEAN
  }, {
      timestamps: false,
    });
  tbl_kpim_scores.removeAttribute('id');

  tbl_kpim_scores.associate = function (models) {
    // associations can be defined here
    tbl_kpim_scores.belongsTo(models.tbl_kpims, { foreignKey: "kpim_id" })
  };

  return tbl_kpim_scores;
};
