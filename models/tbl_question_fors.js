'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_question_fors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_question_fors.belongsTo(models.tbl_question_helpdesks, { foreignKey: 'question_id' })
      tbl_question_fors.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
      tbl_question_fors.belongsTo(models.tbl_companys, { foreignKey: 'company_id' })
      tbl_question_fors.belongsTo(models.tbl_departments, { foreignKey: 'departments_id' })
    }
  };
  tbl_question_fors.init({
    question_id: DataTypes.INTEGER,
    option: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    departments_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_question_fors',
  });
  return tbl_question_fors;
};