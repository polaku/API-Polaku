'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_question_helpdesks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_question_helpdesks.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
      tbl_question_helpdesks.belongsTo(models.tbl_sub_topics_helpdesks, { foreignKey: 'sub_topics_id' })
      tbl_question_helpdesks.hasMany(models.tbl_question_likes, { foreignKey: 'question_id' })
      tbl_question_helpdesks.hasMany(models.tbl_question_fors, { foreignKey: 'question_id' })
    }
  };
  tbl_question_helpdesks.init({
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    sub_topics_id: DataTypes.STRING,
    help: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_question_helpdesks',
  });
  return tbl_question_helpdesks;
};