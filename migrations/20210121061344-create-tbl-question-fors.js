'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_question_fors', {
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
      option: {
        type: Sequelize.STRING
      },
      company_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_companys',
          key:'company_id'
        },
        onDelete: 'CASCADE'
      },
      departments_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_departments',
          key:'departments_id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('tbl_question_fors');
  }
};