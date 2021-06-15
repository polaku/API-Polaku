'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_admin_companies', 'notification_category_id', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'tbl_notification_categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_admin_companies', 'notification_category_id')
  }
};
