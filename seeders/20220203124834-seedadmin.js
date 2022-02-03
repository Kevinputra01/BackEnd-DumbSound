'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@mail.com",
          password:
            "$2b$10$Jm6awszFP4iFxqRKVxZz5.vRdHX.eVJynzVrZQ724DHVfjvqPAuYG", //123456
          fullname: "admin",
          status: "1",
          gender: "Male",
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
