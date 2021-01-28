'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_question_helpdesks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING(255)
      },
      answer: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_users',
          key:'user_id'
        },
        onDelete: 'SET NULL'
      },
      sub_topics_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_sub_topics_helpdesks',
          key:'sub_topics_id'
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
    await queryInterface.dropTable('tbl_question_helpdesks');
  }
};