'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_tal_scores = sequelize.define('tbl_tal_scores', {
    tal_score_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    tal_id: DataTypes.INTEGER,
    load: DataTypes.STRING,
    when_day: DataTypes.STRING,
    when_date: DataTypes.STRING,
    weight: DataTypes.STRING,
    achievement: DataTypes.STRING,
    score_tal: DataTypes.INTEGER,
    link: DataTypes.STRING,
    week: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    active_flag: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    hasConfirm: DataTypes.BOOLEAN,
  }, {
      timestamps: false,
    });
  tbl_tal_scores.removeAttribute('id');

  tbl_tal_scores.associate = function (models) {
    // associations can be defined here
    tbl_tal_scores.belongsTo(models.tbl_tals, { foreignKey: "tal_id" })
  };

  return tbl_tal_scores;
};
