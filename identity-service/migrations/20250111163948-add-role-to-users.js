'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add the 'role' column as an ENUM type with default 'user'.
     */
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',  // Default to 'user'
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * In the `down` method, you should remove the 'role' column and the enum type.
     */
    await queryInterface.removeColumn('Users', 'role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";'); // Clean up the ENUM type
  }
};
