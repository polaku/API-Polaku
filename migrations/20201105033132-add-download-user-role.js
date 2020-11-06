'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_user_roles', 'download', Sequelize.BOOLEAN)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_user_roles', 'download');
  }
};
