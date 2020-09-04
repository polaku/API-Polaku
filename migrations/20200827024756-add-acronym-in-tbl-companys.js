'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tbl_companys', 'acronym', Sequelize.STRING(15));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tbl_companys', 'acronym');
  }
};
