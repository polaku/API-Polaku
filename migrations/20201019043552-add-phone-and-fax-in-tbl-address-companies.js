'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_buildings', 'phone'),
      queryInterface.removeColumn('tbl_buildings', 'fax'),

      queryInterface.addColumn('tbl_address_companies', 'phone', Sequelize.STRING),
      queryInterface.addColumn('tbl_address_companies', 'fax', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('tbl_buildings', 'phone', Sequelize.STRING),
      queryInterface.addColumn('tbl_buildings', 'fax', Sequelize.STRING),

      queryInterface.removeColumn('tbl_address_companies', 'phone'),
      queryInterface.removeColumn('tbl_address_companies', 'fax'),
    ])
  }
};
