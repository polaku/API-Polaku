'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_sub_topics_helpdesks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_sub_topics_helpdesks.belongsTo(models.tbl_topics_helpdesks, { foreignKey: 'topics_id' })
      tbl_sub_topics_helpdesks.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
      tbl_sub_topics_helpdesks.hasMany(models.tbl_question_helpdesks, { foreignKey: 'sub_topics_id' })
    }
  };
  tbl_sub_topics_helpdesks.init({
    sub_topics: DataTypes.STRING,
    topics_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_sub_topics_helpdesks',
  });
  return tbl_sub_topics_helpdesks;
};