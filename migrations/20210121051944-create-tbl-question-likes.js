'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_question_likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_question_helpdesks',
          key:'question_id'
        },
        onDelete: 'CASCADE'
      },
      like: {
        type: Sequelize.BOOLEAN
      },
      unlike: {
        type: Sequelize.BOOLEAN
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_users',
          key:'user_id'
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
    await queryInterface.dropTable('tbl_question_likes');
  }
};