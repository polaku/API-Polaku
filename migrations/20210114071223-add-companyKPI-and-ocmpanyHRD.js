'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    return Promise.all([
      queryInterface.addColumn('tbl_account_details', 'company_KPI', {
        type: Sequelize.INTEGER,
        as: 'company_KPI',
        reference: {
          model: 'tbl_company',
          key: 'company_KPI',
        },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('tbl_account_details', 'company_HRD', {
        type: Sequelize.INTEGER,
        as: 'company_HRD',
        reference: {
          model: 'tbl_company',
          key: 'company_HRD',
        },
        onDelete: 'SET NULL'
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_account_details', 'company_KPI'),
      queryInterface.removeColumn('tbl_account_details', 'company_HRD')
    ])
  }
};
