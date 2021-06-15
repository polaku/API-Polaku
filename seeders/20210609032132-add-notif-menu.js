'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tbl_menus', [{
      menu_id: 10,
      label: 'Notifikasi',
      link: '',
      icon: '',
      parent: 0,
      sort: 0,
      time: new Date(),
      status: 1,
      active: 1
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
  }
};
