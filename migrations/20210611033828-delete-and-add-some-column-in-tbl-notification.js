'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_notifications', 'company_id'),
      queryInterface.removeColumn('tbl_notifications', 'departments_id'),
      queryInterface.addColumn('tbl_notifications', 'id_created', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_notifications', 'company_id', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_companys',
          key: 'company_id'
        }
      }),
      queryInterface.addColumn('tbl_notifications', 'departments_id', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_departments',
          key: 'departments_id'
        }
      }),
      queryInterface.removeColumn('tbl_notifications', 'id_created'),
    ])
  }
};
