'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_room_operation_hours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_room_operation_hours.init({
    day: DataTypes.STRING,
    start: DataTypes.TIME,
    end: DataTypes.TIME,
    room_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_room_operation_hours',
  });
  return tbl_room_operation_hours;
};