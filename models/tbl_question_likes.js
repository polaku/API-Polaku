'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_question_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_question_likes.belongsTo(models.tbl_question_helpdesks, { foreignKey: 'question_id' })
      tbl_question_likes.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
      
    }
  };
  tbl_question_likes.init({
    question_id: DataTypes.INTEGER,
    like: DataTypes.BOOLEAN,
    unlike: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_question_likes',
  });
  return tbl_question_likes;
};