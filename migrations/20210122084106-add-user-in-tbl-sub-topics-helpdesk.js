'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_sub_topics_helpdesks', 'user_id', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'tbl_users',
        key: 'user_id',
      },
      onDelete: 'SET NULL'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_sub_topics_helpdesks', 'user_id')      
  }
};
