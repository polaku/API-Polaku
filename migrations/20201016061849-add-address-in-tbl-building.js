'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_address_companies', 'address'),
      queryInterface.removeColumn('tbl_address_companies', 'acronym'),
      queryInterface.removeColumn('tbl_address_companies', 'phone'),
      queryInterface.removeColumn('tbl_address_companies', 'fax'),

      queryInterface.addColumn('tbl_buildings', 'address', Sequelize.STRING),
      queryInterface.addColumn('tbl_buildings', 'acronym', Sequelize.STRING),
      queryInterface.addColumn('tbl_buildings', 'phone', Sequelize.STRING),
      queryInterface.addColumn('tbl_buildings', 'fax', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('tbl_address_companies', 'address', Sequelize.STRING),
      queryInterface.addColumn('tbl_address_companies', 'acronym', Sequelize.STRING),
      queryInterface.addColumn('tbl_address_companies', 'phone', Sequelize.STRING),
      queryInterface.addColumn('tbl_address_companies', 'fax', Sequelize.STRING),

      queryInterface.removeColumn('tbl_buildings', 'address'),
      queryInterface.removeColumn('tbl_buildings', 'acronym'),
      queryInterface.removeColumn('tbl_buildings', 'phone'),
      queryInterface.removeColumn('tbl_buildings', 'fax'),
    ])
  }
};
