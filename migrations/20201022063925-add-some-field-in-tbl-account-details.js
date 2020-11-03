'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_account_details', 'nickname', Sequelize.STRING),
      queryInterface.addColumn('tbl_account_details', 'departments_id', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_departments',
          key: 'departments_id',
        }
      }),
      queryInterface.addColumn('tbl_account_details', 'status_employee', Sequelize.STRING),
      queryInterface.addColumn('tbl_account_details', 'join_date', Sequelize.DATE),
      queryInterface.addColumn('tbl_account_details', 'start_leave_big', Sequelize.DATE),
      queryInterface.addColumn('tbl_account_details', 'leave_big', Sequelize.INTEGER),
      queryInterface.addColumn('tbl_account_details', 'next_frame_date', Sequelize.DATE),
      queryInterface.addColumn('tbl_account_details', 'next_lensa_date', Sequelize.DATE),
      queryInterface.addColumn('tbl_account_details', 'dinas_id', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_dinas',
          key: 'id',
        },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('tbl_account_details', 'office_email', Sequelize.STRING)
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('tbl_account_details', 'nickname'),
      queryInterface.removeColumn('tbl_account_details', 'departments_id'),
      queryInterface.removeColumn('tbl_account_details', 'status_employee'),
      queryInterface.removeColumn('tbl_account_details', 'join_date'),
      queryInterface.removeColumn('tbl_account_details', 'start_leave_big'),
      queryInterface.removeColumn('tbl_account_details', 'leave_big'),
      queryInterface.removeColumn('tbl_account_details', 'next_frame_date'),
      queryInterface.removeColumn('tbl_account_details', 'next_lensa_date'),
      queryInterface.removeColumn('tbl_account_details', 'dinas_id'),
      queryInterface.removeColumn('tbl_account_details', 'office_email')
    ])
  }
};
