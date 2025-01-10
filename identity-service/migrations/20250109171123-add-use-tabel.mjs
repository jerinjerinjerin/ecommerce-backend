'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isAuthenticated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      otpExpiredAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      profileUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJr-fGkiy1DE5A0JNOkcmCNGcXuQXdzENZA&s",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
