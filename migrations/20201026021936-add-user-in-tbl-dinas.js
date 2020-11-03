'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_dinas', 'user_id', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'tbl_users',
        key: 'user_id',
      },
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_dinas', 'user_id');
  }
};
