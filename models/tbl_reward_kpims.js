'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_reward_kpims = sequelize.define('tbl_reward_kpims', {
    reward_kpim_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nilai_bawah: DataTypes.INTEGER,
    nilai_atas: DataTypes.INTEGER,
    reward: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
      timestamps: false,
    });
  tbl_reward_kpims.removeAttribute('id');

  tbl_reward_kpims.associate = function (models) {
    // associations can be defined here
    tbl_reward_kpims.belongsTo(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_reward_kpims;
};
