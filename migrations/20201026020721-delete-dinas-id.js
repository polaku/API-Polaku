'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_account_details', 'dinas_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_account_details', 'dinas_id', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'tbl_dinas',
        key: 'id',
      },
      onDelete: 'SET NULL'
    })
  }
};
