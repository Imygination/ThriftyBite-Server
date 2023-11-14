'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Stores", [
      {
        name: "andika store",
        address: "Yogyakarta",
        location: Sequelize.fn(
          'ST_GeomFromText',
          'POINT(107.59278847659893 -6.942981263106864)'
        ),
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Stores")
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
