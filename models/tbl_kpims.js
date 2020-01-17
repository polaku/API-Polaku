'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_kpims = sequelize.define('tbl_kpims', {
    kpim_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    indicator_kpim: DataTypes.STRING,
    target: DataTypes.STRING,
    unit: DataTypes.STRING,
    pencapaian: DataTypes.STRING,
    year: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  }, {
      timestamps: false,
    });
  tbl_kpims.removeAttribute('id');

  tbl_kpims.associate = function (models) {
    // associations can be defined here
    tbl_kpims.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_kpims;
};
