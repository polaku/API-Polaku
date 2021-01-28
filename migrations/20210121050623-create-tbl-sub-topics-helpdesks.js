'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_sub_topics_helpdesks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sub_topics: {
        type: Sequelize.STRING(200)
      },
      topics_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_topics_helpdesks',
          key:'topics_id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_sub_topics_helpdesks');
  }
};