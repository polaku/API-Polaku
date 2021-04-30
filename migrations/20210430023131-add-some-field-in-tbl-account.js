'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_account_details', 'no_KK', Sequelize.STRING(200)),
      queryInterface.addColumn('tbl_account_details', 'mother_name', Sequelize.STRING(250)),
      queryInterface.addColumn('tbl_account_details', 'married_status', Sequelize.BOOLEAN),
      queryInterface.addColumn('tbl_account_details', 'blood_type', Sequelize.STRING(5)),
      queryInterface.addColumn('tbl_account_details', 'education', Sequelize.STRING(150)),
      queryInterface.addColumn('tbl_account_details', 'no_bpjs_kes', Sequelize.STRING(200)),
      queryInterface.addColumn('tbl_account_details', 'no_bpjs_tk', Sequelize.STRING(200)),
      queryInterface.addColumn('tbl_account_details', 'no_npwp', Sequelize.STRING(200)),
      queryInterface.addColumn('tbl_account_details', 'gender', Sequelize.ENUM('Male', 'Female')),
      queryInterface.addColumn('tbl_account_details', 'religion', Sequelize.STRING(100)),
      queryInterface.addColumn('tbl_account_details', 'no_rek', Sequelize.STRING(200)),
      queryInterface.addColumn('tbl_account_details', 'bank', Sequelize.STRING(100)),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_account_details', 'no_KK'),
      queryInterface.removeColumn('tbl_account_details', 'mother_name'),
      queryInterface.removeColumn('tbl_account_details', 'married_status'),
      queryInterface.removeColumn('tbl_account_details', 'blood_type'),
      queryInterface.removeColumn('tbl_account_details', 'education'),
      queryInterface.removeColumn('tbl_account_details', 'no_bpjs_kes'),
      queryInterface.removeColumn('tbl_account_details', 'no_bpjs_tk'),
      queryInterface.removeColumn('tbl_account_details', 'no_npwp'),
      queryInterface.removeColumn('tbl_account_details', 'gender'),
      queryInterface.removeColumn('tbl_account_details', 'religion'),
      queryInterface.removeColumn('tbl_account_details', 'no_rek'),
      queryInterface.removeColumn('tbl_account_details', 'bank')
    ])
  }
};
