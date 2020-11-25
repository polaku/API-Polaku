'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_rooms', 'access_by', Sequelize.STRING),
      queryInterface.addColumn('tbl_rooms', 'operational_day', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_rooms', 'access_by'),
      queryInterface.removeColumn('tbl_rooms', 'operational_day')
    ])
  }
};
