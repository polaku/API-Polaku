'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_admin_companies', 'designations_id', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'tbl_designations',
        key: 'designations_id',
      },
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_admin_companies', 'designations_id');
  }
};
