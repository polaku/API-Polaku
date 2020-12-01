'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_activity_logins', 'is_mobile', Sequelize.BOOLEAN)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_activity_logins', 'is_mobile')
  }
};
