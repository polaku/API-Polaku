'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_tals = sequelize.define('tbl_tals', {
    tal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    indicator_tal: DataTypes.STRING,
    load: DataTypes.STRING,
    when_day: DataTypes.STRING,
    when_date: DataTypes.STRING,
    weight: DataTypes.STRING,
    achievement: DataTypes.STRING,
    link: DataTypes.STRING,
    week: DataTypes.STRING,
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    active_flag: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  }, {
      timestamps: false,
    });
  tbl_tals.removeAttribute('id');

  tbl_tals.associate = function (models) {
    // associations can be defined here
    tbl_tals.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_tals;
};
