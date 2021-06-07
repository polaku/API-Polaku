'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_notifications', 'title', Sequelize.STRING),
      queryInterface.addColumn('tbl_notifications', 'contact', Sequelize.STRING),
      queryInterface.addColumn('tbl_notifications', 'is_for_all', Sequelize.BOOLEAN),
      queryInterface.addColumn('tbl_notifications', 'is_notif_polaku', Sequelize.BOOLEAN),
      queryInterface.addColumn('tbl_notifications', 'category_notification_id', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_notification_categories',
          key: 'id'
        }
      }),
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
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_notifications', 'title'),
      queryInterface.removeColumn('tbl_notifications', 'contact'),
      queryInterface.removeColumn('tbl_notifications', 'is_for_all'),
      queryInterface.removeColumn('tbl_notifications', 'is_notif_polaku'),
      queryInterface.removeColumn('tbl_notifications', 'category_notification_id'),
      queryInterface.removeColumn('tbl_notifications', 'company_id'),
      queryInterface.removeColumn('tbl_notifications', 'departments_id')
    ])
  }
};
