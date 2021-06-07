'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_notification_categories', 'user_id',
      {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tbl_users',
          key: 'user_id'
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_notification_categories', 'user_id')
  }
};
