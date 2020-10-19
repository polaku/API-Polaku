'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_address_companies', 'building_id', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'tbl_buildings',
        key: 'building_id',
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_address_companies', 'building_id')
  }
};
