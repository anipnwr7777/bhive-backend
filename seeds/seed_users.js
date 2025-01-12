/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

exports.seed = async function (knex) {
  await knex('users').del();

  const users = [];
  for (let i = 1; i <= 20; i++) {
    const passwordHash = await bcrypt.hash('password123', 10);
    users.push({
      email: faker.internet.email(),
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  await knex('users').insert(users);
};
