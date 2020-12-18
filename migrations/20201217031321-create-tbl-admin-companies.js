'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_admin_companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_users',
          key:'user_id'
        },
        onDelete: 'CASCADE'
      },
      company_id: {
        type: Sequelize.INTEGER,
        reference: {
          model:'tbl_companys',
          key:'company_id'
        },
        onDelete: 'CASCADE'
      },
      PIC: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('tbl_admin_companies');
  }
};