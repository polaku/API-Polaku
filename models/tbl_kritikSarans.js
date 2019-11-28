'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_kritik_sarans = sequelize.define('tbl_kritik_sarans', {
    user_id: DataTypes.INTEGER,
    value: DataTypes.STRING,
  }, {
    timestamps: false,
  });

  tbl_kritik_sarans.associate = function (models) {
    // associations can be defined here
    tbl_kritik_sarans.hasMany(models.tbl_users, { foreignKey: "user_id" })
  };

  return tbl_kritik_sarans;
};
