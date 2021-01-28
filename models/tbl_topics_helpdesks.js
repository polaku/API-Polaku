'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_topics_helpdesks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_topics_helpdesks.hasMany(models.tbl_sub_topics_helpdesks, { foreignKey: 'topics_id' })
      tbl_topics_helpdesks.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    }
  };
  tbl_topics_helpdesks.init({
    topics: DataTypes.STRING,
    icon: DataTypes.STRING,
    order: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_topics_helpdesks',
  });
  return tbl_topics_helpdesks;
};