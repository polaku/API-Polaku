'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_account_details', 'updatedAt', Sequelize.DATE)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_account_details', 'updatedAt');
  }
};
