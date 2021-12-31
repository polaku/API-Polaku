'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_tals', 'type', Sequelize.STRING),
      queryInterface.addColumn('tbl_tals', 'order_by_user', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_users',
          key: 'departments_id'
        }
      }),
      queryInterface.addColumn('tbl_tals', 'order_by_company', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_companys',
          key: 'company_id'
        }
      }),


      queryInterface.addColumn('tbl_tal_scores', 'status', Sequelize.BOOLEAN),
      queryInterface.addColumn('tbl_tal_scores', 'achievement_star', Sequelize.INTEGER),
      queryInterface.addColumn('tbl_tal_scores', 'review', Sequelize.STRING),
      queryInterface.addColumn('tbl_tal_scores', 'time_start', Sequelize.TIME),
      queryInterface.addColumn('tbl_tal_scores', 'time_stop', Sequelize.TIME),
      queryInterface.addColumn('tbl_tal_scores', 'timesheet', Sequelize.STRING),

    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_tals', 'type'),
      queryInterface.removeColumn('tbl_tals', 'order_by_user'),
      queryInterface.removeColumn('tbl_tals', 'order_by_company'),

      queryInterface.removeColumn('tbl_tal_scores', 'status'),
      queryInterface.removeColumn('tbl_tal_scores', 'achievement_star'),
      queryInterface.removeColumn('tbl_tal_scores', 'review'),
      queryInterface.removeColumn('tbl_tal_scores', 'time_start'),
      queryInterface.removeColumn('tbl_tal_scores', 'time_stop'),
      queryInterface.removeColumn('tbl_tal_scores', 'timesheet')
    ])
  }
};
